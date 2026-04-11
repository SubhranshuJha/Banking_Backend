import mongoose from 'mongoose';
import accountModel from '../models/account.model.js';
import transactionModel from '../models/transaction.model.js';
import ledgerModel from '../models/ledger.model.js';
import userModel from '../models/user.model.js';

const buildClientError = (message, statusCode = 400) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const getErrorStatusCode = (error) => error.statusCode || 500;

const validatePositiveAmount = (value) => {
  const amount = Number(value);

  if (!Number.isFinite(amount) || amount <= 0) {
    throw buildClientError('Invalid amount');
  }

  return amount;
};

const isTransactionUnsupportedError = (error) => {
  const message = error?.message || '';
  return (
    message.includes('Transaction numbers are only allowed on a replica set member or mongos') ||
    message.includes('does not support retryable writes')
  );
};

const withOptionalTransaction = async (operation) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const result = await operation(session);
    await session.commitTransaction();
    return result;
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }

    if (isTransactionUnsupportedError(error)) {
      return operation(null);
    }

    throw error;
  } finally {
    session.endSession();
  }
};

const withSession = (query, session) => (session ? query.session(session) : query);
const createOptions = (session) => (session ? { session } : undefined);

const createTransaction = async (req, res) => {
  const { fromAccount, toAccount, idempotencyKey } = req.body;
  const amount = Number(req.body.amount);

  if (!fromAccount || !toAccount || req.body.amount === undefined || !idempotencyKey) {
    return res.status(400).json({ success: false, message: 'All fields required' });
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    return res.status(400).json({ success: false, message: 'Invalid amount' });
  }

  if (!mongoose.Types.ObjectId.isValid(fromAccount) || !mongoose.Types.ObjectId.isValid(toAccount)) {
    return res.status(400).json({ success: false, message: 'Invalid account id' });
  }

  if (fromAccount === toAccount) {
    return res.status(400).json({ success: false, message: 'Source and destination accounts must be different' });
  }

  try {
    const result = await withOptionalTransaction(async (session) => {
      const existingTx = await withSession(transactionModel.findOne({ idempotencyKey }), session);

      if (existingTx) {
        return { created: false, tx: existingTx };
      }

      const fromAcc = await withSession(accountModel.findById(fromAccount), session);
      const toAcc = await withSession(accountModel.findById(toAccount), session);

      if (!fromAcc || !toAcc) {
        throw buildClientError('Account not found', 404);
      }

      if (String(fromAcc.user) !== String(req.user._id)) {
        throw buildClientError('Unauthorized source account', 403);
      }

      if (fromAcc.status !== 'active' || toAcc.status !== 'active') {
        throw buildClientError('Inactive account', 409);
      }

      const balance = await fromAcc.getBalance({ session });
      if (balance < amount) {
        throw buildClientError('Insufficient balance', 409);
      }

      const tx = (
        await transactionModel.create(
          [
            {
              fromAccount,
              toAccount,
              amount,
              idempotencyKey,
              status: 'pending'
            }
          ],
          createOptions(session)
        )
      )[0];

      await ledgerModel.create(
        [
          {
            account: fromAccount,
            type: 'debit',
            amount,
            transaction: tx._id
          }
        ],
        createOptions(session)
      );

      await ledgerModel.create(
        [
          {
            account: toAccount,
            type: 'credit',
            amount,
            transaction: tx._id
          }
        ],
        createOptions(session)
      );

      tx.status = 'completed';
      await tx.save(createOptions(session));

      return { created: true, tx };
    });

    if (!result.created) {
      return res.status(200).json({ success: true, message: 'Already processed', existingTx: result.tx });
    }

    return res.status(201).json({
      success: true,
      message: 'Transaction completed',
      tx: result.tx
    });
  } catch (err) {
    return res.status(getErrorStatusCode(err)).json({
      success: false,
      message: err.message
    });
  }
};

const createInitialFundsTransaction = async ({
  toAccountId,
  amount: inputAmount,
  idempotencyKey
}) => {
  if (!toAccountId || inputAmount === undefined || !idempotencyKey) {
    throw buildClientError('All fields required');
  }

  const amount = validatePositiveAmount(inputAmount);

  if (!mongoose.Types.ObjectId.isValid(toAccountId)) {
    throw buildClientError('Invalid account id');
  }

  return withOptionalTransaction(async (session) => {
    const toAccount = await withSession(accountModel.findById(toAccountId), session);

    if (!toAccount) {
      throw buildClientError('Receiver account not found', 404);
    }

    if (toAccount.status !== 'active') {
      throw buildClientError('Inactive account', 409);
    }

    const systemUser = await withSession(
      userModel.findOne({ systemUser: true }).select('+systemUser'),
      session
    );

    if (!systemUser) {
      throw buildClientError('System user missing', 500);
    }

    const systemAccount = await withSession(
      accountModel.findOne({ user: systemUser._id, status: 'active' }),
      session
    );

    if (!systemAccount) {
      throw buildClientError('System account missing', 500);
    }

    const existing = await withSession(transactionModel.findOne({ idempotencyKey }), session);

    if (existing) {
      return { tx: existing, created: false };
    }

    const tx = (
      await transactionModel.create(
        [
          {
            fromAccount: systemAccount._id,
            toAccount: toAccountId,
            amount,
            idempotencyKey,
            status: 'pending',
            type: 'system_funding'
          }
        ],
        createOptions(session)
      )
    )[0];

    await ledgerModel.create(
      [
        {
          account: systemAccount._id,
          type: 'debit',
          amount,
          transaction: tx._id
        }
      ],
      createOptions(session)
    );

    await ledgerModel.create(
      [
        {
          account: toAccountId,
          type: 'credit',
          amount,
          transaction: tx._id
        }
      ],
      createOptions(session)
    );

    tx.status = 'completed';
    await tx.save(createOptions(session));

    return { tx, created: true };
  });
};

const systemInitialFunds = async (req, res) => {
  try {
    const { toAccountId, amount, idempotencyKey } = req.body;

    const result = await createInitialFundsTransaction({
      toAccountId,
      amount,
      idempotencyKey
    });

    return res.status(result.created ? 201 : 200).json({
      success: true,
      message: result.created ? 'Initial funds added' : 'Already processed',
      tx: result.tx
    });
  } catch (err) {
    return res.status(getErrorStatusCode(err)).json({
      success: false,
      message: err.message
    });
  }
};

export { createTransaction, createInitialFundsTransaction, systemInitialFunds };
