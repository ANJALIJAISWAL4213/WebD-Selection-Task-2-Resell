require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/user');
const productRoutes = require('./routes/product');
//const cartRoutes = require('./routes/cart');
const checkoutRoutes = require('./routes/checkout'); // Import checkout routes
const reviewRoutes = require('./routes/review'); // Import review routes

const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// Logging middleware for requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Route definitions
app.use('/api/users', userRoutes); 
app.use('/api/products', productRoutes);
//app.use('/api/cart', cartRoutes);
app.use('/api/checkout', checkoutRoutes); // Add checkout routes
app.use('/api/review', reviewRoutes); // Add review routes

// Connect to MongoDB and start the server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Connected to DB & listening on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to the database:', error);
  });

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});
