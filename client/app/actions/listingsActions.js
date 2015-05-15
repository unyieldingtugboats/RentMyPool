var ListingsDispatcher = new Flux.Dispatcher();

var ListingsActions = {

  listingSubmitted: function (load) {
    ListingsDispatcher.dispatch({
      type: ListingsConstants.LISTING_SUBMITTED,
      load: load
    });
  },

  poolTypeAdded: function (load) {
  	console.log('dispatch.poolTypeAdded Called');
  	ListingsDispatcher.dispatch({
  		type: ListingsConstants.POOL_TYPE_ADD,
  		load: load
  	})
  },

  poolTypeRemoved: function (load) {
  	ListingsDispatcher.dispatch({
  	        type: ListingsConstants.POOL_TYPE_REMOVE,
  		load: load
  	})
  },

  removeListing: function (load) {
    Listings.Dispatcher.dispatch({
      type: ListingsConstants.REMOVE_LISTING,
      load: load
    });
  }


};
