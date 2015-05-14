var ListingsDispatcher = new Flux.Dispatcher();

var ListingsActions = {

  listingSubmitted: function (load) {
    ListingsDispatcher.dispatch({
      type: ListingsConstants.LISTING_SUBMITTED,
      load: load
    });
  },

  poolTypeAdded: function (load) {
  	ListingsDispatcher.dispatch({
  		type: ListingsConstants.POOL_TYPE_ADD,
  		load: load
  	})
  }

};