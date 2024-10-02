// const requireSellerRole = (req, res, next) => {
//     if (req.user.role !== 'seller') {
//       return res.status(403).json({ message: 'Access denied: Only sellers can manage products' });
//     }
//     next();
//   };
  
//   module.exports = requireSellerRole;
  


const requireSellerRole = (req, res, next) => {
    // Check if the user is authenticated and the user object exists
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized: Authentication required' });
    }
  
    // Check if the user's role is 'seller'
    if (req.user.role !== 'seller') {
      return res.status(403).json({ message: 'Access denied: Only sellers can manage products' });
    }
  
    // Proceed to the next middleware if the user is a seller
    next();
  };
  
  module.exports = requireSellerRole;
  