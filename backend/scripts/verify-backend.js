import jwt from 'jsonwebtoken';

process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';

const modulesToImport = [
  '../src/config/connectDB.js',
  '../src/models/user.model.js',
  '../src/models/account.model.js',
  '../src/models/transaction.model.js',
  '../src/models/ledger.model.js',
  '../src/models/blacklist.model.js',
  '../src/services/email.service.js',
  '../src/controller/auth.controller.js',
  '../src/controller/account.controller.js',
  '../src/controller/transaction.controller.js',
  '../src/middleware/auth.middleware.js',
  '../src/routes/auth.routes.js',
  '../src/routes/accounts.route.js',
  '../src/routes/transaction.route.js',
];

for (const modulePath of modulesToImport) {
  await import(modulePath);
}

const sampleToken = jwt.sign({ userId: '507f191e810c19729de860ea' }, process.env.JWT_SECRET);

if (!sampleToken) {
  throw new Error('JWT token generation failed');
}

console.log('Backend verification passed');
