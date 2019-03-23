const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express from server folder' });
});

/* GET login page. */
router.get('/login', function(req, res) {
  res.render('login', {
    title: 'Login Page',
    message: ''/*req.flash('loginMessage')*/
  });
});

/* GET Signup page. */
router.get('/signup', function(req, res) {
  res.render('signup', {
    title: 'Signup Page',
    message: ''/*req.flash('loginMessage')*/
  });
});

/* GET Profile page. */
router.get('/profile', function(req, res) {
  res.render('profile', {
    title: 'Profile Page',
    user : req.user,
    avatar: gravatar.url(req.user.email ,  {s: '100', r: 'x', d: 'retro'}, true)
  });
});


module.exports = router;
