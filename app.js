var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var sassMiddleware = require('node-sass-middleware');
// ODM With Mongoose
var mongoose = require('mongoose');
// Modules to store session
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
// Import Passport and Warning flash modules
var passport = require('passport');
var flash = require('connect-flash');
// Database configuration
var config = require('./server/config/config.js');

// Routers
var indexRouter = require('./server/routes/index');
var usersRouter = require('./server/routes/users');

var app = express();

// connect to our database
mongoose.connect(config.url,  { useNewUrlParser: true });
// Check if MongoDB is running
mongoose.connection.on('error', function() {
  console.error('MongoDB Connection Error. Make sure MongoDB is running.');
});


// Passport configuration
require('./server/config/passport')(passport);


// view engine setup
app.set('views', path.join(__dirname, 'server/views/pages'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true, // true = .sass and false = .scss
  sourceMap: true
}));

app.use(express.static(path.join(__dirname, 'public')));

// required for passport
// secret for session
app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true,

 //store session on MongoDB using express-session connect mongo
  store: new MongoStore({
    url: config.url,
    collection : 'sessions'
  })
}));

// Init passport authentication
app.use(passport.initialize());

// persistent login sessions
app.use(passport.session());

// flash messages
app.use(flash());

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

app.set('port', process.env.PORT || 3000);

const server = app.listen(app.get('port'), function () {
  console.log('Express server listening on port ' +
      server.address().port);
});
