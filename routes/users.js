const express = require('express');
const router = express.Router();
const authController = require('../controllers/AuthController');
const {redirectIfAuthenticated, ensureAuthenticated} = require('../helpers/auth');
// a middleware function with no mount path. This code is executed for every request to the router
router.use(function (req, res, next) {
  console.log('Time:', Date.now(), req.originalUrl);
  next();
});

/* GET users listing. */
router.get('/', function (req, res) {
  res.redirect('/login');
});
router.route('/login')
  .get(authController.login)
  .post(authController.loginPost);
router.route('/register')
  .get(redirectIfAuthenticated, authController.register)
  .post(redirectIfAuthenticated, authController.registerPost);
router.post('/logout', ensureAuthenticated, authController.logout);
module.exports = router;
