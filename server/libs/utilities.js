var session = require('express-session');

exports.isLoggedIn = function(request) {
    if(request.session) {
        return !!request.session.username;
    }
    return false
};

exports.checkUser =  function(request, response, next) {
    console.log('checking user');
    if(!exports.isLoggedIn(request) && request.url.toLowerCase() !== "/home") {
        console.log('not logged in! redirect');
        response.redirect("/Home")
    } 
    else {
        console.log('check user callback time! (user/sess valid!)')
        next();
    }
}

exports.createSession = function(request, response, user) {
    console.log('createSession');
    return request.session.regenerate(function(err) {
        if(err) {
            console.log('error in creating a session', err);
            throw err;
        }
        request.session.username = user;
        console.log('created that session, redirect to home');
        response.status(302).send("/Home");
    });
}