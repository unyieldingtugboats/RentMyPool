var db = require('./db/configMongoose');
var express = require('express');
var partials = require('express-partials');
var Item = require('./db/dbModels/itemModel.js');
var User = require('./db/dbModels/userModel.js');
var bodyParser = require('body-parser');
var multer  = require('multer');
<<<<<<< HEAD
var url = require('url');
=======
var session = require('express-session');
var utils = require('./libs/utilities.js');
>>>>>>> woo! sessions, hmm redirects having issue not really sure why!

var app = express()
app.use(multer({ dest: './uploads/'}))

app.use(bodyParser.json());
app.use(express.static(__dirname + '/../client'));

<<<<<<< HEAD

app.get('/rentItems', function(req, res){
  console.log(req.url);
  var query = url.parse(req.url).query;
  var date = req.query.date || '2015/05/06';
  Item.find({}, function(err, docs){
    if(!err){
      var resDocs = docs.filter(function(doc) {
        if (!doc.calendar) return true;
        return !doc.calendar.hasOwnProperty(date);
      });
      res.status(200).send({results: resDocs});
    } else {
      console.log(err)
      res.status(500).send({errorMessage: 'We fucked up. Sorry:( Woo!'});
    }
=======
app.use(session({
  secret: 'be very quiet its a secret, WOOO!',
  resave: false, // session store needs touch method for this to be ok
  saveUninitialized : false
  //cookie: { secure : true} // requires https
}));

app.get('/index', function(req,res) {
  console.log('Test test test');
  res.redirect('/');
});

app.get('/rent', function(req, res){
  console.log('rent get');
  utils.checkUser(req,res, function() {
    console.log('rent page!')
    var date = req.body.date || '2015/05/06';
    Item.find({}, function(err, docs){
      if(!err){
        res.status(200).send({results: docs});
      } else {
        console.log(err)
        res.status(500).send({errorMessage: 'We fucked up. Sorry:( Woo!'});
      }
    });
>>>>>>> woo! sessions, hmm redirects having issue not really sure why!
  });
});

app.get('*', function (req, res) {
  var options = {
    root: __dirname + '/../client',
  };
  res.sendFile('index.html', options, function (err) {
    if(err) console.log(err);
  });
});

app.get('/list', function(req, res) {
  console/log('check user for list page!');
  utils.checkUser(req,res,function(){
    console.log('hey lists page!');
  });
});

app.post('/list', function(req, res){
  utils.checkUser(req,res,function() {
    console.log('List post');
    var newPool = new Item({name: req.body.name, address: req.body.address, price: req.body.price});
    newPool.save(function(err) {
      if(err){
        console.log(err);
      }
      res.status(201).send({post: 'you posted to the database'});
    });
  });
});

app.post('/book', function(req, res){
  console.log(req.body);
  if (req.body.date.length === 10) {
    Item.findOne({_id : req.body._id}, function(err, pool){
      if(!err){
        if (!pool.calendar) pool.calendar = {};
        pool.calendar[req.body.date] = true;
        pool.markModified('calendar');
        pool.save();
        res.status(302).send('Payment');
      } else {
        console.log(err)
        res.status(500).send({errorMessage: 'We fucked up. Sorry:( Woo!'});
      }
    });
  } else {
    console.log('date not 8 chars');
    res.status(500).send({errorMessage: 'We fucked up. Sorry:( Woo!'});
  }
});

app.post('/uploadimg', function(req, res){
  utils.checkUser(req,res,function() {
    console.log('Uploading');
    console.log( req.files);
    res.status(201).send('1');
  });
});

app.post('/signup', function(req, res) { 
  var info = req.body;
  User.findOne({ username : info.username}, function(err, user) {
    if(err) {
      console.log('signup, error',err);
      res.status(500).send({errorMessage: 'error in searching database upon signup'});
    }
    else if (!user) {
      var newUser = new User({
        username: info.username,
        password: info.password
      });

      newUser.save(function(err, newUser) {
        if(err) {
          console.log('error in saving new user information');
          res.status(500).send({errorMessage: 'error in saving user info to Database'})
        }
        else {
          utils.createSession(req,res,user.username);
          console.log('successful signup');
        }
      });
    }
    else {
      console.log('username is already taken!', user);
      res.status(302).send('Sign Up');
    }
  });
});

app.post('/login', function(req, res) {
  var info = req.body;
  User.findOne({username: info.username}, function(err, user) {
    if(err) {
      res.status(500).send({errorMessage: 'error in search of db upon login'});
    } 
    else if(user) {
      user.comparePassword(info.password, function(err, match) {
        if(err) {
          console.log('error in comparison!', err);
          res.status(500).send({errorMessage:'error in comparison of password'});
        }
        else {
          if(match) {
            // res.status(302).send('/');
            utils.createSession(req,res,user.username);
            console.log('successful login!');
          } 
          else {
            console.log('password fail!');
            res.status(302).send('Login');
          }
        }
      });
    }
    else {
      console.log('username does not exist')
      res.status(302).send('Login');
    }
  });
});

module.exports = app;
