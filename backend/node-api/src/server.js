const env = require('./config/env');
const connectDB = require('./config/db');
const app = require('./app');

const start = async () => {
  await connectDB();
  app.listen(env.port, () => {
    console.log(`NyayaSetu API running on port ${env.port} [${env.nodeEnv}]`);
  });
};

start();
