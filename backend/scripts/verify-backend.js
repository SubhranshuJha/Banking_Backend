import assert from 'assert/strict';
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
  '../src/app.js'
];

for (const modulePath of modulesToImport) {
  await import(modulePath);
}

const { createApp, startServer } = await import('../src/app.js');
const sampleToken = jwt.sign({ userId: '507f191e810c19729de860ea' }, process.env.JWT_SECRET);

assert.ok(sampleToken, 'JWT token generation failed');

const app = createApp();
assert.equal(typeof app.use, 'function', 'Express app should be created');
assert.equal(typeof startServer, 'function', 'startServer export should be available');

console.log('Backend verification passed');
