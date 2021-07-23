const router = require('express').Router();

// Controllers
const UserController = require('../user/userControler');

// Middlewares
const UserMiddleware = require('../user/auth');

// User routes
router.post('/user/signup', UserController.signUp);
router.post('/user/login', UserController.login);
router.get('/user/logout', UserMiddleware.authenticate, UserController.logout);
router.get('/user', UserMiddleware.authenticate, UserController.getUserInfo);
router.patch('/user', UserMiddleware.authenticate, UserController.editUser);

router.delete(
  '/user',
  UserMiddleware.authenticate,
  UserController.deleteAccount
);
router.get('/allUsers', UserController.getAllUsers);

// Export
module.exports = router;
