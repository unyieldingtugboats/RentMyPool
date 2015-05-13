// get pool listings from the server
var _fetchEntries = function () {
  return new Promise(function (resolve, reject) {
    $.get("/rentItems", function (data) {
      resolve(data);
    });
  });
};

// add a listing to the server
var _postBooking = function (date, id) {
  return new Promise(function (resolve, reject) {
    $.ajax({
      url: "/book",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify({date : date, _id : id}),
      statusCode: {
        302: function (data) {
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

var _getUserReviews = function(id) {
  return new Promise(function(resolve, reject) {
    $.ajax({
      url: "/userReviews",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify({user_id: id}),
      statusCode: {
        201: function (data) {
          resolve({
            statusCode: 201,
            data: data
          });
        },
        500: function (err) {
          console.log("Error:", err);
          reject(err);
        }
      }
    });
  });
};

var _postReview = function(review) {
  console.log('_postReview');
  console.log(review);
  return new Promise(function (resolve, reject) {
    $.ajax({
      url: "/review",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify(review),
      statusCode: {
        201: function (data) {
          resolve({
            statusCode: 201,
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

  addReviewSubmittedListener: function (callback) {
    this.on(RentConstants.REVIEW_SUBMITTED, callback);
  },

  addNewReviewsListener: function (callback) {
    this.on(RentConstants.NEW_REVIEW, callback);
  },

  addCityStateListener: function (callback) {
    this.on(RentConstants.CITYSTATE, callback);
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

  removeReviewSubmittedListener: function (callback) {
    this.removeListener(RentConstants.REVIEW_SUBMITTED, callback);
  }

});

// these actions are called when the dispatcher in rentActions emits an action (ex. ENTRY_CLICKED or FETCH_ENTRIES)
RentDispatcher.register(function (action) {
  var actions = {};

  actions[RentConstants.ENTRY_CLICKED] = function () {
    RentStore.emit(RentConstants.ENTRY_CLICKED, action.load);
  };

  // fetch data from the server, then emit a change to listening views and send the listing data
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
      })
      .catch(function (err) {
        console.log("Booking Error.",err);
      });
  };

  actions[RentConstants.FILTER_CHANGE] = function () {
    RentStore.emit(RentConstants.FILTER_CHANGE, action.load);
  };

  actions[RentConstants.REVIEW_SUBMITTED] = function () {
    console.log('REVIEW SUBMITTED!')
    console.log(action.load);
    //post request to server
    _postReview(action.load)
      .then(function (data) {
        console.log('posted');
        RentStore.emit(RentConstants.NEW_REVIEW, data.data);
      })
      .catch(function (err) {
        console.log('error', err);
      });
  };

  actions[RentConstants.FETCH_REVIEWS] = function() {
    console.log('fetching reviews...');
    console.log(action.load);

    //get the user's reviews from server
    _getUserReviews(action.load)
      .then(function (data) {
        console.log('got reviews');
        console.log(data.data);
        RentStore.emit(RentConstants.REVIEW_SUBMITTED, data.data);
      })
      .catch(function (err) {
        console.log('error', err);
      });
  },

  actions[RentConstants.CITYSTATE] = function() {
    RentStore.emit(RentConstants.CITYSTATE, action.load);
  };

  actions[action.type]();
});

