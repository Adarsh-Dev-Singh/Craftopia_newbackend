require('dotenv').config();
require('express-async-errors');

const express = require('express');
const app = express();

// Extra Security Packages
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit');

// DB connection
const connectDB = require('./db/connect');
const authenticateUser = require('./middleware/authentication');

// Routers
const authRouter = require('./routes/auth');
const itemsRouter = require('./routes/items');
const cartRouter = require('./routes/cart');

// Error handlers
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

// Security middleware
app.use(rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
}));

app.use(helmet());
app.use(xss());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// ✅ Updated CORS configuration
const corsOptions = {
  origin: "https://craftopia-silk.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Handle preflight requests

// Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/items', authenticateUser, itemsRouter);
app.use('/api/v1/order', cartRouter);

// Error handlers
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

// Server start
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
