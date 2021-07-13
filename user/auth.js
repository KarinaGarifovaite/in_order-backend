const jwt = require('jsonwebtoken');
const User = require('./userModel');

const authenticate = async (req, res, next) => {
  let token = req.header('in_order-token');
  try {
    // Verify JWT
    let decodedId = await jwt.verify(token, 'token');
    let authenticatedUser = await User.findOne({
      _id: decodedId._id,
      'sessionToken.token': token,
    });
    if (!authenticatedUser) throw 'Authentication failed';
    // Add user and token to request and go next()
    req.user = authenticatedUser;
    req.token = token;
    next();
  } catch (err) {
    err = err.message == 'jwt malformed' ? 'Wrong session token' : err;
    res.status(401).json(err);
  }
};

module.exports = {
  authenticate,
};
