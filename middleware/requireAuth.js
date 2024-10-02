// const jwt = require('jsonwebtoken');
// const User = require('../models/userModel');

// const requireAuth = async (req, res, next) => {
//   const { authorization } = req.headers;

//   if (!authorization) {
//     return res.status(401).json({ error: 'Authorization token required' });
//   }

//   const token = authorization.split(' ')[1];

//   try {
//     const { _id } = jwt.verify(token, process.env.SECRET);

//     req.user = await User.findById(_id).select('_id email contactInfo location transactionHistory'); // Select relevant fields

//     if (!req.user) {
//       return res.status(401).json({ error: 'User not found' });
//     }

//     next();
//   } catch (error) {
//     console.log(error);
//     res.status(401).json({ error: 'Request is not authorized' });
//   }
// };

// module.exports = requireAuth;




const jwt = require('jsonwebtoken'); 
const User = require('../models/userModel');

const requireAuth = async (req, res, next) => {
  const { authorization } = req.headers;

  // Check if authorization header exists
  if (!authorization) {
    return res.status(401).json({ error: 'Authorization token required' });
  }

  // Extract token from the authorization header
  const token = authorization.split(' ')[1];

  try {
    // Verify the token and extract the user ID
    const { _id } = jwt.verify(token, process.env.SECRET);

    // Find the user by ID and select relevant fields
    req.user = await User.findById(_id).select('_id email contactInfo location transactionHistory'); 

    // Check if user exists
    if (!req.user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Proceed to the next middleware if everything is valid
    next();
  } catch (error) {
    console.error(error); // Log the error for debugging purposes
    res.status(401).json({ error: 'Request is not authorized' });
  }
};

module.exports = requireAuth;
