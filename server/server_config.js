var express = require('express');



var app = express();

app.configure(function(){
  app.use(express.static(__dirname, '/client'));
});

var mockData = {
  results: [{name: 'Eden', address: 'San Francisco', price: 100}, {name: 'derek', address: 'Woo Town', price : 64 }];
}

// '/rent' json listing of pools
app.get('/rent', function(req, res){
  res.send(200, mochData);
});
// '/list' object has a name, address, price

app.post('/list', function(req, res){
  console.log(req.body.data);
  res.redirect('/rent');
});

module.exports = app;
