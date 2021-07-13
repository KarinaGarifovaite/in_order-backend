const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    min: 4,
    max: 20,
  },
  name: {
    type: String,
    required: true,
  },
  passwordOne: {
    type: String,
    required: true,
    max: 20,
    min: 4,
  },
  passwordTwo: {
    type: String,
    required: true,
    max: 20,
    min: 4,
  },
  shoppingList: {
    type: Array,
    default: [],
  },
  sessionToken: [
    {
      token: String,
    },
  ],
});

// Pass hashing
UserSchema.pre('save', function (next) {
  let user = this;
  if (user.isModified('passwordOne') && user.isModified('passwordTwo')) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(
        user.passwordOne && user.passwordTwo,
        salt,
        (err, hassedPassword) => {
          user.passwordOne = hassedPassword;
          user.passwordTwo = hassedPassword;
          next();
        }
      );
    });
    // If password is not modified go next()
  } else {
    next();
  }
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
