var _postLogin = function (user) {
  return new Promise( function (resolve, reject) {
    $.ajax({
      url: "/login",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify(user),
      statusCode: {
        201: function (data) {
          console.log("201");
          resolve(data);
        }
      }, 
      error: function (err) {
        reject("Error");
      }
    });
  })
};

var _fetchUser = function () {
  return new Promise ( function (resolve, reject) {
    $.ajax({
      url: "/currentUser",
      method: "GET",
      contentType: "application/json",
      statusCode: {
        200: function (data) {
          resolve(data);
        }
      }, 
      error: function (err) {
        reject(err);
      }
    });
  });
};

var AppStore = ObjectAssign({}, EventEmitter.prototype, {

  addUserLoginListener: function (callback) {
    this.on(AppConstants.USER_LOGIN, callback);
  },

  addFetchUserListener: function (callback) {
    this.on(AppConstants.FETCH_USER, callback);
  },

  removeUserLoginListener: function (callback) {
    this.removeListener(AppConstants.USER_LOGIN, callback);
  },

  removeFetchUserListener: function (callback) {
    this.removeListener(AppConstants.FETCH_USER, callback);
  }

});

AppDispatcher.register(function (action) {
  var actions = {};

  actions[AppConstants.USER_LOGIN] = function () {
    _postLogin(action.load)
      .then(function (data) {
        AppStore.emit(AppConstants.USER_LOGIN, data);
      });
  };

  actions[AppConstants.FETCH_USER] = function () {
    _fetchUser()
      .then(function (data) {
        AppStore.emit(AppConstants.FETCH_USER, data);
      });
  };

  actions[action.type]();
});
