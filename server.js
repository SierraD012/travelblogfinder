// This is the SERVER-SIDE JS

var util = require('util');
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');

// Local JS files
var scraper = require('./public/javascripts/blogScraper.js');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Globals
var blogPostData = [];

// Runs on server startup - gets initial blog post data
async function startup() {
    console.log(">SERVER: startup() called");
    blogPostData = await scraper.getBlogPosts();
    console.log(">SERVER: got initial blog data, len= " + blogPostData.length);
}
startup();

// GET default homepage
app.get('/', function(req, res){
  console.log(">SERVER: GET homepage requested");
  res.sendFile('main.html', { root: 'public' });
});

// GET route to request brand new blog data - use this when user clicks Refresh button
// Serializes and returns the existing posts data, doesn't call scraper service
app.get('/getPosts', async function(req, res) {
  console.log(">SERVER: GETPOSTS requested");
  
  res.send(JSON.stringify(blogPostData));
  res.end();
});

// GET route to request existing blog data 
// Calls scraper service to re-scrape the blogs and grab brand new posts
app.get('/refreshPosts', async function(req, res) {
  console.log(">SERVER: REFRESHPOSTS requested");
  blogPostData = []; //clear old content
  blogPostData = await scraper.getBlogPosts();

  res.send(JSON.stringify(blogPostData));
  res.end();
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function(err, req, res, next) {
  
  // set locals, only providing error in development
  res.locals.message = err.message;
  console.log(">SERVER.JS: error handler called, err= " + err.message);
  
  
  //res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


//////////////////////
module.exports = app;
