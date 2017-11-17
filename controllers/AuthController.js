const mongoose = require('mongoose');
const utils = require('util');
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);

require('./../models/User');
const User = mongoose.model('user');

exports.profile = (req, res) => {
  res.render('users/profile');
};
exports.login = (req, res) => {
  res.render('users/login');
};
exports.loginPost = (req, res) => {
  if (req.body.email && req.body.password) {
    User.findOne({email: req.body.email})
      .then((user) => {
        const hassPassword = user.password;
        if (bcrypt.compareSync(req.body.password, hassPassword)) {
            return user;
        }
        throw new Error('Login Unsuccessful!');
      })
      .then((user) => {
        req.session.regenerate((err) => {
          if(err) throw new err;
          console.log('Login successful. session regenerated!');
        });
        req.session.user = user;
        req.flash('success_msg', 'Login Successful!');
        res.redirect('/');
      })
      .catch((err) => {
        req.flash('error_msg', err.message);
        res.redirect('/user/login');
      });
  }
};
exports.register = (req, res) => {
  res.render('users/register');
};
exports.registerPost = (req, res) => {
  let errors = [];
  if (!req.body.first_name) {
    errors.push({error_msg: 'First Name can\'t be empty!'});
  }
  if (!req.body.last_name) {
    errors.push({error_msg: 'Last Name can\'t be empty!'});
  }
  if (!req.body.email || !/[\w]+?@[\w]+?\.[a-z]{2,4}/.test(req.body.email)) {
    errors.push({error_msg: 'Email is required and must be valid!'});
  }
  if (!req.body.password) {
    errors.push({error_msg: 'Password can\'t be empty!'});
  }
  if (req.body.password && req.body.password !== req.body.confirm_password) {
    errors.push({error_msg: 'Passwords have to match!'});
  }

  const newUser = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email
  };
  if (errors.length > 0) {
    res.render('users/register', Object.assign(newUser, {errors: errors}));
    return;
  }
  User.findOne({'email': req.body.email})
    .then((user) => {
      if (user) {
        throw new Error('taken');
      } else {
        newUser.password = bcrypt.hashSync(req.body.password, salt);
        return new User(newUser).save();
      }
    })
    .then(() => {
      req.flash('success_msg', 'User Registration has been successful.');
      res.redirect('/user/login');
    })
    .catch((err) => {
      console.warn(err);
      if (err.message !== 'taken') {
        errors.push({error_msg: 'Ohh! Problem in registering the user.'});
      } else {
        errors.push({error_msg: 'The email has already been taken!'});
      }
      res.render('users/register', Object.assign(newUser, {errors: errors}));
    });

};
exports.logout = (req, res) => {
  req.logout();
  req.flash('success_msg', 'Logout successfull.');
  res.redirect('/user/login');
};
