var _fetchEntries = function () {
  return new Promise(function (resolve, reject) {
    $.get("/rentItems", function (data) {
      console.dir(data);
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
      data: JSON.stringify({date : date, _id : id}),
      statusCode: {
        302: function (data) {
          console.log("Posted:", data);
          resolve({
            statusCode: 302,
            data: data
          });
        },
        500: function (err) {
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
    this.on(RentConstants.NEW_BOOKING, callback);
  },

  addFilterChangeListener: function (callback) {
    this.on(RentConstants.FILTER_CHANGE, callback);
  },

  removeEntryClickedListener: function (callback) {
    this.removeListener(RentConstants.ENTRY_CLICKED, callback);
  },

  removeFetchEntriesListener: function (callback) {
    this.removeListener(RentConstants.FETCH_ENTRIES, callback);
  },

  removeNewBookingListener: function (callback) {
    this.removeListener(RentConstants.NEW_BOOKING, callback);
  },

  removeFilterChangeListener: function (callback) {
    this.removeListener(RentConstants.FILTER_CHANGE, callback);
  },

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
        console.log("THEN")
        RentStore.emit(RentConstants.NEW_BOOKING, data);
      })
      .catch(function (err) {
        console.log("Booking Error.",err);
      });
  };

  actions[RentConstants.FILTER_CHANGE] = function () {
    RentStore.emit(RentConstants.FILTER_CHANGE, action.load);
  };

  actions[action.type]();
});

