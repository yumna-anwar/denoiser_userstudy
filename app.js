var express = require('express');
var http = require('http');
var path = require('path');
var net = require('net');
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');
var logger = require('morgan');
var cookieParser = require('cookie-parser');

//LOAD VIEW ENGINE

var index = require('./routes/index');
var study_ui = require('./routes/study_ui');
//var admin = require('./routes/admin')

var net = require('net');

/*
AUTHENTICATION
*/
function checkAuthentification(req, res, next) {
  let req_url = req.url.toString()

  //console.log('url', req_url)
  if (req_url.startsWith('/login')) {
      console.log('this is a login page', req_url)
      next()
  } else {
    if (req_url.startsWith('/study') || req_url.startsWith('/study_admin')) {
      //console.log('ui url')
      if (!req.session || !req.session.authenticated) {
        console.log(req.session)
        console.log('Redirecting to login page')
        res.redirect('/login')
        return
      } else {
        console.log('Session authenticated', req.session.user)
        next()
      }
    } else {
      //console.log('direct')
      next()
    }
  }
}

var app = express();
var server = require('http').createServer(app);
const socketio = require("socket.io");
const io = socketio(server);


// use sessions
var session = require('express-session')
app.use(session({
  secret: 'SimStudy@2019!',
  resave: false,
  saveUninitialized: true,
}))


app.use(express.static(path.join(__dirname, '')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(logger('dev'));
//app.use(net.Socket());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
console.log('static', path.join(__dirname, 'public'))
app.use(express.static(path.join(__dirname, '')));

app.use(checkAuthentification)

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', index);
app.use('/study_ui', study_ui);


app.get('/admin',function(req,res){
res.render('admin',{
  title:'Admin page'
});
});

app.get('/study_question',function(req,res){
res.render('study_question',{
  title:'Admin page'
});
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

server.listen(8001,function(){
console.log('server started on port 8001...');
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

// module.exports = app;
module.exports = {app: app, server: server};
