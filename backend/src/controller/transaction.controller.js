import mongoose from 'mongoose';
import accountModel from '../models/account.model.js';
import transactionModel from '../models/transaction.model.js';
import ledgerModel from '../models/ledger.model.js';        
;


// the 10 steps 
// 1 validate request
// 2 validate idempotencyKey
// 3 check account status
// 4 derive sendder balance from ledger
// 5 create transaction with pending status
// 6 create debit ledger entry 
// 7 create credit ledger entry
// 8 mark trans completed
// 9 commit mongo sessionS
// 10 send email 



const createTransaction = async (req, res) => {
  const { fromAccount, toAccount, amount, idempotencyKey } = req.body;

  if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
    return res.status(400).json({ message: "All fields required" });
  }

  if (amount <= 0) {
    return res.status(400).json({ message: "Invalid amount" });
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const existingTx = await transactionModel
      .findOne({ idempotencyKey })
      .session(session);

    if (existingTx) {
      await session.abortTransaction();
      return res.status(200).json({ message: "Already processed", existingTx });
    }

    const fromAcc = await accountModel
      .findById(fromAccount)
      .session(session);

    const toAcc = await accountModel
      .findById(toAccount)
      .session(session);

    if (!fromAcc || !toAcc) throw new Error("Account not found");

    if (fromAcc.status !== "active" || toAcc.status !== "active")
      throw new Error("Inactive account");

    const balance = await fromAcc.getBalance({ session });

    if (balance < amount) throw new Error("Insufficient balance");

    const tx = (
      await transactionModel.create(
        [
          {
            fromAccount,
            toAccount,
            amount,
            idempotencyKey,
            status: "pending",
          },
        ],
        { session }
      )
    )[0];

    await ledgerModel.create(
      [
        {
          account: fromAccount,
          type: "debit",
          amount,
          transaction: tx._id,
        },
      ],
      { session }
    );

    await ledgerModel.create(
      [
        {
          account: toAccount,
          type: "credit",
          amount,
          transaction: tx._id,
        },
      ],
      { session }
    );

    tx.status = "completed";
    await tx.save({ session });

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      success: true,
      message: "Transaction completed",
      tx,
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


const createInitialFundsTransaction = async ({
  toAccountId,
  amount,
  idempotencyKey,
}) => {
  if (!toAccountId || !amount || !idempotencyKey) {
    throw new Error("All fields required");
  }

  if (amount <= 0) {
    throw new Error("Invalid amount");
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // find receiver
    const toAccount = await accountModel
      .findById(toAccountId)
      .session(session);

    if (!toAccount) throw new Error("Receiver account not found");

    // find system account
    const systemAccount = await accountModel
      .findOne({ systemUser: true })
      .session(session);

    if (!systemAccount) throw new Error("System account missing");

    // idempotency check
    const existing = await transactionModel
      .findOne({ idempotencyKey })
      .session(session);

    if (existing) {
      await session.abortTransaction();
      return existing;
    }

    // create tx
    const tx = (
      await transactionModel.create(
        [
          {
            fromAccount: systemAccount._id,
            toAccount: toAccountId,
            amount,
            idempotencyKey,
            status: "pending",
            type: "system_funding",
          },
        ],
        { session }
      )
    )[0];

    // debit system
    await ledgerModel.create(
      [
        {
          account: systemAccount._id,
          type: "debit",
          amount,
          transaction: tx._id,
        },
      ],
      { session }
    );

    // credit user
    await ledgerModel.create(
      [
        {
          account: toAccountId,
          type: "credit",
          amount,
          transaction: tx._id,
        },
      ],
      { session }
    );

    tx.status = "completed";
    await tx.save({ session });

    await session.commitTransaction();
    session.endSession();

    return tx;
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};

const systemInitialFunds = async (req, res) => {
  try {
    const { toAccountId, amount, idempotencyKey } = req.body;

    const tx = await createInitialFundsTransaction({
      toAccountId,
      amount,
      idempotencyKey,
    });

    return res.status(201).json({
      success: true,
      message: "Initial funds added",
      tx,
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};



export { createTransaction, createInitialFundsTransaction , systemInitialFunds };