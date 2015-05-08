var RentDispatcher = new Flux.Dispatcher();

var RentActions = {

  entryClicked: function (data) {
    RentDispatcher.dispatch({
      type: RentConstants.ENTRY_CLICKED,
      load: data
    });
  },

  fetchEntries: function (data) {
    RentDispatcher.dispatch({
      type: RentConstants.FETCH_ENTRIES,
      load: data
    });
  },

  newBooking: function (data) {
    RentDispatcher.dispatch({
      type: RentConstants.NEW_BOOKING,
      load: data
    })
  }

}
