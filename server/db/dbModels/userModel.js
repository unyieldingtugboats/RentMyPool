var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
    username : { type: String, required:  true, unique: true },
    password : { type:String, required: true}
    //info on user
    // - email
    // - firstName
    // - lastName
});

var User = mongoose.model('User', userSchema);

User.prototype.comparePassword = function(attemptedPassword, callback) {
    console.log('stored : ', this.password);
    console.log('attempt: ', attemptedPassword);
  bcrypt.compare(attemptedPassword, this.get('password'), function(err, isMatch) {
    if(err) { 
        console.log('error in password compare!');
        callback(err);
    }
    callback(null, isMatch);
  });
};

userSchema.pre('save', function(next) {
    console.log('saving time, password to be hashed', this.password);
    bcrypt.hash(this.password, null, null, function(err, hash) {
        if(err) {
            console.log('error in hashing!', err)
        } else {
            this.password = hash;
            console.log('hash success! ', this.password);
            next();
        }
    });
});

module.exports = User;