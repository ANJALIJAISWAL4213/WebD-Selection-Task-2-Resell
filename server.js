// require('dotenv').config();

// const express = require('express');
// const mongoose = require('mongoose');
// const userRoutes = require('./routes/user');
// const productRoutes = require('./routes/product');

// const app = express();

// // Middleware to parse JSON requests
// app.use(express.json());

// // Middleware for logging requests
// app.use((req, res, next) => {
//   console.log(req.path, req.method);
//   next();
// });

// // User and Product Routes
// app.use('/api/users', userRoutes);
// app.use('/api/products', productRoutes);

// // Connect to MongoDB
// mongoose.connect(process.env.MONGO_URI)
//   .then(() => {
//     app.listen(process.env.PORT, () => {
//       console.log('Connected to DB & listening on port', process.env.PORT);
//     });
//   })
//   .catch((error) => {
//     console.error('Error connecting to the database:', error);
//   });

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ error: 'Something went wrong!' });
// });

// // Catch 404 errors
// app.use((req, res) => {
//   res.status(404).json({ error: 'Not Found' });
// });



require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/user');
const productRoutes = require('./routes/product');
const cartRoutes = require('./routes/cart'); // Import the cart routes

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

app.use('/api/users', userRoutes); 
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes); // Add cart routes

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log('Connected to DB & listening on port', process.env.PORT);
    });
  })
  .catch((error) => {
    console.error('Error connecting to the database:', error);
  });

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});
