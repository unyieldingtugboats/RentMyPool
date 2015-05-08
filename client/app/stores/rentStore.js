var _fetchEntries = function (date, location) {
  return new Promise(function (resolve, reject) {
    $.get("/rentItems?date="+date+"&location="+location, function (data) {
      resolve(data);
    });
  });
};

var RentStore = ObjectAssign({}, EventEmitter.prototype, {

  addEntryClickedListener: function (callback) {
    this.on(RentConstants.ENTRY_CLICKED, callback);
  },

  addFetchEntriesListener: function (callback) {
    this.on(RentConstants.FETCH_ENTRIES, callback);
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

  actions[action.type]();
});