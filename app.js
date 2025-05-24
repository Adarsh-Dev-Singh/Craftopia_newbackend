require('dotenv').config();
require('express-async-errors');

// Extra Security Packages
const helmet = require('helmet')
const cors = require('cors')

const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit')

const express = require('express');
const app = express();
//connectDB
const connectDB = require('./db/connect');
const authenticateUser = require('./middleware/authentication');
//routers
const authRouter = require('./routes/auth')
const itemsRouter = require('./routes/items')
const cartRouter = require('./routes/cart')


// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
app.use(rateLimiter({
  windowMs: 15*60*1000, // 15 minutes (because its in miliseconds)
  max: 100, //limit each IP to make 100 requests per windowMs i.e 15 minutes here
}))
app.use(helmet())
app.use(cors({
  origin: "https://craftopia-silk.vercel.app",
  credentials: true
}));

app.use(express.urlencoded({ extended: false }));
app.use(xss())
app.use(express.json());
// extra packages

// routes
app.use('/api/v1/auth',authRouter);
app.use('/api/v1/items',authenticateUser,itemsRouter);
app.use('/api/v1/order',cartRouter);
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
