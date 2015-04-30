var express = require('express');
var partials = require('express-partials');


var app = express();


app.use(express.static(__dirname + '/../client'));

var mockData = {
  results: [{name: 'Eden', address: 'San Francisco', price: 100}, {name: 'derek', address: 'Woo Town', price : 64 }]
}

app.get('/rent', function(req, res){
  res.status(200).send(mockData);
});

app.post('/list', function(req, res){
  console.log(req.body.data);
  res.status(201).send({post: 'you posted to the database'});
});

module.exports = app;
