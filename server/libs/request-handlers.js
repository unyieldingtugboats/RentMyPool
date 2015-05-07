var utils = require('./utilities.js');
var Item = require('./../db/dbModels/itemModel.js');
var User = require('./../db/dbModels/userModel.js');
var url = require('url');


exports.stub = function (req,res) {
  console.log('stub', req.url);
  res.status(204);
};

exports.getListings = function(req, res) {
  console.log('getListings', req.url);
  utils.checkUser(req,res, function() {
    console.log('getting list!')
      var query = url.parse(req.url).query;
      var date = req.query.date || '2015/05/06';
      //query db for all items listed
      Item.find({}, function(err, items) {
          if(!err) {
            var resultItems = items.filter(function(item) {
              if(!item.calendar) {
                return true;
              }
              return !item.calendar.hasOwnProperty(date);
            })
            console.log('sending items back!');
            res.status(200).send({results: resultItems});
          }
          else {
              console.log('error in retrieving listings', err);
              res.status(500).send({errorMessage: 'error in retrieving listings'});
          }
      })
  });
};

exports.book = function(req, res) {
  var info = req.body;
  if(info.date.length === 10) {
    Item.findOne({_id : info._id}, function(err, pool) {
      if(!err) {
        pool.calendar = pool.calendar || {};
        pool.calendar[info.date] = true;
        pool.markModified('calendar');
        pool.save(function(err, pool) {
          if(err) { 
            console.log('error in saving in booking');
            res.status(500).send({errorMessage : 'error with saving booking'});
          }
          else {
            res.status(302).send('Payment');
          }
        });
      }
      else {
        console.log('error in query of db for booking');
        res.status(500).send({errorMessage: 'error in query of db for booking'});
      }
    })
  }
  else {
    console.log('date is fudged up!');
    res.status(500).send({errorMessage: 'error with date in booking!'});
  }
};

exports.serveIndex = function(req, res) {
  console.log('serveIndex', req.url);
  var options = {
    root: __dirname + '/../../client',
  };
  res.sendFile('index.html', options, function (err) {
    if(err) {
      console.log('error in serving index.html', err);
      res.status(500).send({errorMessage: 'error on serving index.html!'})
    }
    else {
      console.log('serving those files! woo!');
    }
  });
};

exports.checkServeIndex = function(req, res) {
  console.log('checkServeIndex', req.url)
  utils.checkUser(req, res, exports.serveIndex.bind(null, req, res));
};

exports.addItemToListings = function(req, res) {
  console.log('addItemToListings');
  utils.checkUser(req, res, function() {
    var itemInfo = req.body;
    var newPool = new Item({ name : itemInfo.name, 
                             address : itemInfo.address,
                             price : itemInfo.price });
    newPool.save(function(err) {
      if(err) {
        console.log('error in saving new listing', err);
        res.status(500).send({errorMessage : 'error in saving new listing' });
      }
      else {
        console.log('added item to listings');
        res.status(201).send({successMessage : 'you posted to the database'});
      }
    })
  });
};

exports.uploadImage = function(req, res) {
  console.log('uploadImage', req.url);
  utils.checkUser(req,res,function() {
    console.log('Uploading');
    console.log( req.files);
    res.status(201).send('1');
  });
};

exports.signUpUser = function(req, res) {
  console.log('signUpUser', req.url);
  var info = req.body;
  User.findOne({ username : info.username }, function(err, user) {
    if(err) {
      console.log('error in checking database in sign up', err);
      res.status(500).send({errorMessage: 'error in searching database upon signup'});
    }
    else if( ! user ) {
      var newUser = new User({
        username : info.username,
        password : info.password
      });

      newUser.save(function(err, newUser) {
        if(err) {
          console.log('error in saving new user information to db');
          res.status(500).send({errorMessage: 'error in saving user info to Database'});
        } 
        else {
          utils.createSession(req,res,user.username);
        }
      });
    }
    else {
      console.log('username is already taken!', user);
      res.status(302).send('Sign Up');
    }
  });
};

exports.login = function(req, res) {
  console.log('login', req.url)
  var info = req.body;
  User.findOne({username: info.username}, function(err, user) {
    if(err) {
      console.log('server issue in db query for login');
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
};
