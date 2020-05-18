var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var session = require('express-session');
const MongoStore = require('connect-mongo')(session);
var auth = require("./middlewares/auth");
var flash = require('connect-flash');
var passport = require("passport")


// connect to db
mongoose.connect('mongodb://localhost:27017/blogWithOauth', { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
  console.log("connected", err ? err: true); 
})

require("dotenv").config();
require("./modules/passport")

// routes
var indexRouter = require('./routes/index');
var articlesRouter = require('./routes/articles');
var commentsRouter = require('./routes/comments');
var usersRouter = require('./routes/users');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// Session
app.use(
  session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }
    )
  })
);

// passport initialize
app.use(passport.initialize());
// passport session
app.use(passport.session());

// cookie middleware(should be after cookie-parser & session)
// app.use((req, res, next)=>{
//   if(req.cookies.count) {
//     var num = +req.cookies.count;
//     res.cookie("count", num+1);
//   } else {
//     res.cookie("count", 1);
//   }
//   next();
// })

app.use(flash());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use(auth.checkUserLogged);
app.use(auth.UserInfo);
app.use('/articles', articlesRouter);
app.use('/comments', commentsRouter);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
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
