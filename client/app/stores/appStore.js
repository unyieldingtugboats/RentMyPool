var _postLogin = function (user) {
  return new Promise( function (resolve, reject) {
    $.ajax({
      url: "/login",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify(user),
      statusCode: {
        200: function (data) {
          resolve(data);
        }
      }, 
      error: function () {
        reject("Error");
      }
    });
  })
};

var AppStore = ObjectAssign({}, EventEmitter.prototype, {

  addUserLoginListener: function (callback) {
    this.on(AppConstants.USER_LOGIN, callback);
  },

  addUserClickedListener: function (callback) {
    this.on(AppConstants.USER_CLICKED, callback);
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

  actions[action.type]();
});