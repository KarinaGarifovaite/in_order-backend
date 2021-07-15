const bcrypt = require('bcrypt');
const User = require('./userModel');
const jwt = require('jsonwebtoken');

//User registration and validation
const signUp = async (req, res) => {
  let user = new User(req.body);

  try {
    let alreadyExist = await User.findOne({
      username: req.body.username,
    });
    const regex = /\d/;
    if (alreadyExist) throw 'Username already exist';
    if (user.username.length < 4)
      throw 'Username should be at least 4 symbols length!';
    if (user.username.length > 20)
      throw 'Username should not be longer than 20 symbols!';
    if (user.passwordOne !== user.passwordTwo) throw 'Password does not match!';
    if (user.passwordOne.length < 4 || user.passwordTwo.length < 4)
      throw 'Password should contain at least 4 symbols!';
    if (user.passwordOne.length > 20 || user.passwordTwo.length > 20)
      throw 'Password should not be longer than 20 symbols!';
    if (regex.test(user.passwordOne) !== true)
      throw 'Password should include at least one number!';
    let createdUser = await user.save();
    res.json({ success: true, createdUser, msg: 'User created successfully' });
  } catch (err) {
    res.json({ success: false, message: err });
  }
};

// Login
const login = async (req, res) => {
  try {
    let user = await User.findOne({ username: req.body.username });
    if (!user) throw "User doesn't exist";
    // Check password
    let passwordMatched = await bcrypt.compare(
      req.body.password,
      user.passwordOne
    );
    if (!passwordMatched) throw 'Incorrect password';
    // Create JWT Token from User._id and add to User
    let token = await jwt.sign({ _id: user._id.toHexString() }, 'token');
    user.sessionToken.push({ token });
    await user.save();
    // Send response with token in headers
    res.json({ success: true, msg: 'Logged in', token: token });
    res.header('in_order-token', token).json(user);
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: err });
  }
};

// logout
const logout = async (req, res) => {
  // Take token and user after authentication (from middleware)
  let token = req.token;
  let user = req.user;
  try {
    // Remove token from User tokens array
    await user.update({ $pull: { sessionTokens: { token } } });
    res.json('Successfull logout');
  } catch (err) {
    res.status(400).json(err);
  }
};

// Get user infomation
const getUserInfo = async (req, res) => {
  let token = req.header('in_order-token');
  try {
    let user = await User.findOne({
      'sessionToken.token': token,
    });
    res.json({
      username: user.username,
      name: user.name,
      shoppingList: user.shoppingList,
    });
  } catch (err) {
    res.status(400).json(err);
  }
};

// Edit user info
const editUser = async (req, res) => {
  let token = req.header('in_order-token');
  try {
    let updatedUser = await User.findOneAndUpdate(
      {
        'sessionToken.token': token,
      },
      req.body
    );
    res.send(updatedUser);
  } catch (err) {
    res.status(400).json(err);
  }
};

// delete account
const deleteAccount = async (req, res) => {
  let token = req.header('in_order-token');
  try {
    let deletedUser = await User.findOneAndDelete({
      'sessionToken.token': token,
    });
    res.json({ success: true, deletedUser, msg: 'Account deleted' });
  } catch (err) {
    res.status(404).json(err);
  }
};

module.exports = {
  signUp,
  login,
  logout,
  getUserInfo,
  deleteAccount,
  editUser,
};
