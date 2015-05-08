var _fetchEntries = function (date, location) {
  return new Promise(function (resolve, reject) {
    $.get("/rentItems?date="+date+"&location="+location, function (data) {
      resolve(data);
    });
  });
};

var _postBooking = function (date, id) {
  return new Promise(function (resolve, reject) {
    $.ajax({
      url: "/book",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify({date : this.props.date, _id : this.props.rental.item._id}),
      statusCode: {
        302: function (data) {
          resolve({
            statusCode: 302,
            data: data
          });
        },
        error: function (err) {
          console.log("Error:", err)
          reject(err);
        }
      }
    });
  });
};

var RentStore = ObjectAssign({}, EventEmitter.prototype, {

  addEntryClickedListener: function (callback) {
    this.on(RentConstants.ENTRY_CLICKED, callback);
  },

  addFetchEntriesListener: function (callback) {
    this.on(RentConstants.FETCH_ENTRIES, callback);
  },

  addNewBookingListener: function (callback) {

  }

});

RentDispatcher.register(function (action) {
  var actions = {};

  actions[RentConstants.ENTRY_CLICKED] = function () {
    RentStore.emit(RentConstants.ENTRY_CLICKED, action.load);
  };

  actions[RentConstants.FETCH_ENTRIES] = function () {
    _fetchEntries(action.load.date, action.load.location)
      .then(function (data) {
        RentStore.emit(RentConstants.FETCH_ENTRIES, data);
      });
  };

  actions[RentConstants.NEW_BOOKING] = function () {
    _postBooking(action.load.date, action.load.id)
      .then(function (data) {
        this.emit(RentConstants.NEW_BOOKING, data);
      }.bind(this));
  };

  actions[action.type]();
});