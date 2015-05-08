var Dispatcher = new Flux.Dispatcher();

var RentActions = {

  entryClicked: function (data) {
    Dispatcher.dispatch({
      type: RentConstants.ENTRY_CLICKED,
      load: data
    });
  },

  fetchEntries: function (data) {
    Dispatcher.dispatch({
      type: RentConstants.FETCH_ENTRIES,
      load: data
    });
  }

}
