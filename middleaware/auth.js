const jwt = require('jsonwebtoken');

// Middleware to check if the user is logged in
const authMiddleware = (req, res, next) => {
  // Get the token from the request header
  const token = req.header('Authorization');

  // Check if token is missing or invalid
  if (!token) {
    req.isAuthenticated = false;
    return next();
  }

  try {
    // Verify the token
    const decodedToken = jwt.verify(token, 'your-secret-key'); // Replace with your own secret key

    // Attach the decoded user information to the request
    req.user = decodedToken.user;
    req.isAuthenticated = true;

    next();
  } catch (error) {
    req.isAuthenticated = false;
    next();
  }
};

module.exports = authMiddleware;
