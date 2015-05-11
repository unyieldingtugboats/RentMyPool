var _postListing = function (load) {
  console.dir(load);
  var fileH = load.file;
  load.file = "";
  return new Promise(function (resolve, reject) {
    var form = new FormData();
    form.append("file",fileH);
    var xhr = new XMLHttpRequest();
    xhr.open('post', '/uploadimg', true);
    xhr.onload= function (data) {
      load.file = xhr.responseText;
      $.ajax({
        url: "/list",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify(load),
        file: load.file,
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
    }
    xhr.send(form);
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