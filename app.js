const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const path = require('path');
// const favicon = require('serve-favicon');
const methodOverride = require('method-override');
const flash = require('connect-flash');

const logger = require('morgan');
const bodyParser = require('body-parser');
const handleBars = require('express-handlebars');

const dbConfig = require('./config/db');
const indexRoutes = require('./routes/index');
const usersRoutes = require('./routes/users');

const app = express();

mongoose.Promise = global.Promise;
mongoose.connect(dbConfig.mongoUri, {
  useMongoClient: true
})
  .then(() => {
    console.log('Mongodb is connected!!');
  })
  .catch(err => {
    console.warn(err);
  });

// setting up session
let sessionOption = {
  name: 'id',
  secret: 'naguib-al-taufique',
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: (60 * 60 * 3), // life span :  7 hours
    //  stringify: true
  }),
  resave: false,
  saveUninitialized: true,
  cookie: {
    path: '/',
    maxAge: (1000 * 60 * 60 * 3), // session life span :  6 hours
    httpOnly: true,
  }
};
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1); // trust first proxy
  sessionOption.cookie.secure = true; // serve secure cookies
}
app.use(session(sessionOption));
app.use(flash());

app.disable('x-powered-by');
app.use(methodOverride('_method'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', handleBars({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
if (process.env.NODE_ENV === 'production') {
  app.use(logger('dev'));
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.session.user || req.user || null;
  console.log(req.session.user);
  next();
});

app.use('/', indexRoutes);
app.use('/user', usersRoutes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
