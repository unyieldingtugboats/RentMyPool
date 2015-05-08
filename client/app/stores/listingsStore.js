var _postListing = function (load) {
  return new Promise(function (resolve, reject) {
    $.ajax({
      url: "/list",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify(load),
      success: function (data, statusCode) {
        var dataObj = {
          data: data,
          statusCode: statusCode
        }
        resolve(dataObj);
      },
      error: function () {
        reject(load);
      }
    });
  });

};

var ListingsStore = ObjectAssign({}, EventEmitter.prototype, {

  addListingSubmittedListener: function (callback) {
    this.on(ListingsConstants.LISTING_SUBMITTED, callback);
  }

});


ListingsDispatcher.register(function (action) {
  var actions = {};

  actions[ListingsConstants.LISTING_SUBMITTED] = function () {
    _postListing(action.load).then(function (data) {
      ListingsStore.emit(ListingsConstants.LISTING_SUBMITTED, data);
    });
  };

  actions[action.type]();
});