var db = require('./db/configMongoose');
var express = require('express');
var partials = require('express-partials');
var bodyParser = require('body-parser');
var multer  = require('multer');

var session = require('express-session');
var handlers = require('./libs/request-handlers');

var app = express()
app.use(multer({ dest: './uploads/'}))

app.use(bodyParser.json());
app.use(express.static(__dirname + '/../client'));

app.use(session({
  secret: 'be very quiet its a secret, WOOO!',
  resave: false, // session store needs touch method for this to be ok
  saveUninitialized : false
  //cookie: { secure : true} // requires https
}));

app.get('/rentItems', handlers.getListings);

app.get('/favicon.ico', handlers.stub)

app.get('*', handlers.checkServeIndex);

app.get('/rentItems', handlers.getListings);

app.post('/book', handlers.book);

app.post('/list', handlers.addItemToListings);

app.post('/uploadimg', handlers.uploadImage);

app.get('/signup', handlers.serveIndex);
app.post('/signup', handlers.signUpUser);

app.get('/login', handlers.serveIndex);
app.post('/login', handlers.login);

module.exports = app;
