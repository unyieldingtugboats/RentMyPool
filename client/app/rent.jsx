// view for an individual entry in the pool listing
var ListEntry = React.createClass({

  handleClick: function () {
    RentActions.entryClicked(this.props);
  },

  render: function () {
    return (
      <div className="listEntry" onClick={this.handleClick}>
        {this.props.listing.name +' - ' + this.props.listing.address + ' - ' + this.props.listing.price + ' - ' + new Date(this.props.listing.date).toDateString().slice(3)}
      </div>
    );
  }

});

// view for the list of available pools
var Listings = React.createClass({

  getInitialState: function () {
    return {
      data: [],
      allData: []
    };
  },

  /*
   * before mounting:
   * - add listeners. 
   *   addFetchEntriesListener listens for changes in the data (ex. adding a new listing), and refreshes the list
   *    addFilterChangeListener listens for search input and filters the data
   * - fetch the entries from the server, which triggers this.refreshResults
   *
   */
  componentWillMount: function () {
    RentStore.addFetchEntriesListener(this.refreshResults);
    RentStore.addFilterChangeListener(this.handleFilterChange);

    RentActions.fetchEntries();
  },

  componentWillUnmount: function () {
    RentStore.removeFetchEntriesListener(this.refreshResults);
    RentStore.removeFilterChangeListener(this.handleFilterChange);    
  },

  handleNewEntries: function (data) {
    this.setState({data: data});
  },

  handleFilterChange: function (data) {
    var newEntries =  this.state.allData;
    if(data.date)
      newEntries = newEntries.filter(function (item, index) {
        if(item.date && item.date.includes(data.date))
          return true;
        else return false;
      });

    if(data.location)
      newEntries = newEntries.filter(function (item, index) {
        if(item.address.includes(data.location))
          return true;
        else return false;
      });

    this.handleNewEntries(newEntries);
  },

  refreshResults: function (data) {
      this.setState({allData: data},
        function () {
          this.handleNewEntries(data);
        });
  },

  render: function () {
    var listItems = this.state.data.map(function (item, index) {
      return (
        <ListEntry key={index} listing ={item} />
      );
    });

    return (
      <div className="listings">
        {listItems}
      </div>
    );
  }
});

var Filter = React.createClass({

  getInitialState: function() {
    return {
      date: null,
      location : null,
    };
  },

  componentDidMount: function () {
    $( "#datepicker" ).datepicker()
      .on("input change", this.handleDateChange);
  },

  handleDateChange: function(e) {
    var date = e.target.value;
    this.setState({
      date: date
    },
      function () {
        RentActions.filterChange(this.state);
      }
    );
  },

  handleLocationChange: function(e) {
    this.setState({
      location: e.target.value
    },
      function () {
        RentActions.filterChange(this.state);
      }
    );
  },

  render: function () {

    return (
      <div className="filter">
        <input type="text" id="datepicker" name="date" placeholder="Date" />
        <input type="text" name="location" placeholder="Location" onChange={this.handleLocationChange} />
      </div>
    );
  }
});

// view for an individual booking, including a map view and image of the pool
// this view shows when a listing is selected from the list
var Booking = React.createClass({

  getInitialState: function() {
    return {
      noDetails: true,
      rental: {},
      reviews: []
    };
  },

  // listen for when an entry is clicked
  componentDidMount: function () {
    RentStore.addEntryClickedListener(this.handleEntryClicked);
    RentStore.addReviewSubmittedListener(this.refreshReviews);
    RentStore.addNewReviewsListener(this.handleNewReviews);
  },

  componentWillUnmount: function () {
    RentStore.removeEntryClickedListener(this.handleEntryClicked);
    RentStore.removeReviewSubmittedListener(this.refreshReviews);
  },

  //shows the entry that was clicked
  handleEntryClicked: function (load) {
    // get the listing entry
    this.setState({
      noDetails: false,
      rental: load
    }, function() { 
        console.log(this.state.rental);
        //get reviews
        RentActions.fetchReviews(this.state.rental.listing.user_id);
    });
  },

  handleNewReviews: function () {
    RentActions.fetchReviews(this.state.rental.listing.user_id);
  },

  //refresh the reviews view
  refreshReviews: function (data) {
    console.log('reviews received!');
    this.setState({
      reviews: data
    }, function() { 
        console.log(this.state.reviews);
    });
  },

  handleBooking: function() {
    RentActions.newBooking(this.state.rental);
  },

  // handle a submitted review
  handleSubmit: function(e) {
    e.preventDefault();
    var $form = $('#review')[0];
    var formData = {
      rating: Number($form.rating.value),
      comment: $form.comment.value,
      user_id: this.state.rental.listing.user_id
    };

    $form.rating.value = '';
    $form.comment.value = '';

    RentActions.reviewSubmitted(formData);
  },

  render: function () {
    if (this.state.noDetails) { 
      return (
        <div className="booking">
          <h3>Please select a rental.</h3>
        </div>
        );
    } else {
      // format price display
      var formatedPrice = "";
      var rawPrice = String(this.state.rental.listing.price);
      var j;
      for(var i = 1; i <= rawPrice.length; i++) {
        j=rawPrice.length - i;
        if(!(i % 3) && i < rawPrice.length) 
          formatedPrice = "," + rawPrice[j] + formatedPrice;
        else 
          formatedPrice = rawPrice[j] + formatedPrice;
      }
      formatedPrice = "$" + formatedPrice;

      //render list of reviews
      var reviews = this.state.reviews;
      if(reviews.length) {
        var reviewList = reviews.map(function (item, index) {
          return (
            <div key={index} className="review">
              <form>
                <StarRating name="rating" ratingAmount={5} rating={item.rating} disabled={true} />
              </form>
              <br />
              <p>{item.comment}</p>
            </div>
          );
        });
      } else { reviews = {}; }

      console.log(reviews);

      return (
        <div className="booking">
          <h2 className="h4book">{this.state.rental.listing.name}</h2>
          <h3>{this.state.rental.listing.address}</h3>
          <img className="poolImg" src={this.state.rental.listing.img}/> 
          <h3>{new Date(this.state.rental.listing.date).toDateString().slice(4)}</h3>
          <h4 className="h4book">{formatedPrice}</h4>
          <button className="button" onClick={this.handleBooking}>Book now</button>
          <br />
          <br />
          <h3>Reviews for this Renter:</h3>
            {reviewList}
          <br />
          <h4 className="h4book">Leave a Review:</h4>
            <form id="review">
              <StarRating name="rating" ratingAmount={5} />
              <br />
              <br />
              <textarea rows="4" cols="45" type="text" name="comment" placeholder="Comments">
              </textarea>
              <br />
              <br />
              <input type="submit" value="Submit Review" className="button" onClick={this.handleSubmit}/>
            </form>
        </div>
      );
    }
  }
});


var RentContent = React.createClass({

  mixins: [ReactRouter.Navigation],

  getInitialState: function () {
    return {
      data: [],
      date: ''
    };
  },

  componentWillMount: function () {
    RentStore.addNewBookingListener(this.handleBooking);
  },

  componentWillUnmount: function () {
    RentStore.removeNewBookingListener(this.handleBooking);
  },

  handleBooking: function (data) {
    this.transitionTo("Confirmation");
  },
  
  render: function () {
    
    return (
      <div className="rentPool">
        <LoginTransitioner />
        <h1>Rent a Pool</h1>
        <Filter cb={this}/>
        <div className="showRents">
          <div className="showList">
            <Listings />
            <Booking />
          </div>
          <div className="showDetails">
            <GoogleMap />
            <Weather />
          </div>
        </div>
      </div>
    );
  }
});


var GoogleMap = React.createClass({

  map: null,
  geocoder: new google.maps.Geocoder(),
  oldMarker: null,
  address: [],

  componentDidMount: function () {
    this.initializeMap();
    RentStore.addEntryClickedListener(this.handleEntryClicked);
  },

  componentWillUnmount: function () {
    RentStore.removeEntryClickedListener(this.handleEntryClicked);
  },

  handleEntryClicked: function (load) {
    this.codeAddress(load.listing.address);
  },

  codeAddress: function (address) {
    if (this.oldMarker) this.oldMarker.setMap(null);
    this.geocoder.geocode( { 'address': address}, function(results, status) {

      // Extract the city and state from Google location object (to use with weather API)
      // address[1] is the city name
      // address[2] is the 2-digit state abbreviation
      this.address = /,\s([a-zA-Z\s]+),\s(\w{2})/g.exec(results[0].formatted_address);
      this.address = [this.address[1],this.address[2]];
      // dispatch event for sending city/state data to weather component
      RentActions.sendCityState(this.address);

      if (status == google.maps.GeocoderStatus.OK) {
        this.map.setCenter(results[0].geometry.location);

        var marker = new google.maps.Marker({
            map: this.map,
            position: results[0].geometry.location
        });
        this.oldMarker = marker;
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    }.bind(this));
  },

  initializeMap: function () {
    var latlng = new google.maps.LatLng(37.783551, -122.408990);
    var mapOptions = {
     zoom: 14,
     center: latlng
    }
    this.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
  },

  render: function () {
    return (
      <div id="map-canvas"></div>
    );
  }

});

// Create Weather component
var Weather = React.createClass({
  getInitialState: function() {
    return {
      city: 'san fran'
    }
  },

  componentDidMount: function() {
    RentStore.addCityStateListener(this.updateInfo);
  },

  updateInfo: function(data) {
    this.setState({city: data[0]});
    console.log('from the weather component:', data);
  },

  render: function() {
    return ( <div id="weather">It be hot in {this.state.city}</div> );
  }
});

