var mongoose = require('mongoose');


var reviewSchema = mongoose.Schema({
  rating: Number, //star rating
  comment: String
});

var Review = mongoose.model('Review', reviewSchema );

module.exports = Review;
