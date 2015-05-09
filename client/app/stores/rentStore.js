var _fetchEntries = function () {
  return new Promise(function (resolve, reject) {
    $.get("/rentItems", function (data) {
      console.log(data);
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

  },

  addFilterChangeListener: function (callback) {
    this.on(RentConstants.FILTER_CHANGE, callback);
  }

});

RentDispatcher.register(function (action) {
  var actions = {};

  actions[RentConstants.ENTRY_CLICKED] = function () {
    RentStore.emit(RentConstants.ENTRY_CLICKED, action.load);
  };

  actions[RentConstants.FETCH_ENTRIES] = function () {
    _fetchEntries()
      .then(function (data) {
        RentStore.emit(RentConstants.FETCH_ENTRIES, data.results);
      });
  };

  actions[RentConstants.NEW_BOOKING] = function () {
    _postBooking(action.load.date, action.load.id)
      .then(function (data) {
        RentStore.emit(RentConstants.NEW_BOOKING, data);
      }.bind(this));
  };

  actions[RentConstants.FILTER_CHANGE] = function () {
    RentStore.emit(RentConstants.FILTER_CHANGE, action.load);
  };

  actions[action.type]();
});

