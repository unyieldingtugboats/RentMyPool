var AppDispatcher = new Flux.Dispatcher();

var AppActions = {

  userLogin: function (data) {
    AppDispatcher.dispatch({
      type: AppConstants.USER_LOGIN,
      load: data
    });
  },

  fetchUser: function (data) {
    AppDispatcher.dispatch({
      type: AppConstants.FETCH_USER,
      load: data
    });
  }

};