var ListEntry = React.createClass({

  handleClick: function () {
    RentActions.entryClicked(this.props);
  },

  render: function () {
    return (
      <div className="listEntry" onClick={this.handleClick}>
        {this.props.name +' - ' + this.props.address + ' - ' + this.props.price + ' - ' + new Date(this.props.date).toDateString().slice(3)}
      </div>
    );
  }

});

var Listings = React.createClass({

  getInitialState: function () {
    return {
      data: [],
      allData: []
    };
  },

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
        <ListEntry key={index} id={item._id} imgPath={item.img} date={item.date} name={item.name} address={item.address} price={item.price} />
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

var Booking = React.createClass({

  getInitialState: function() {
    return {
      noDetails: true,
      rental: {}
    };
  },

  componentDidMount: function () {
    RentStore.addEntryClickedListener(this.handleEntryClicked);
  },

  componentWillUnmount: function () {
    RentStore.removeEntryClickedListener(this.handleEntryClicked);
  },

  handleEntryClicked: function (load) {
   this.setState({
      noDetails: false,
      rental: load
    });
  },

  handleBooking: function() {
    console.log(this.state.rental);
    RentActions.newBooking(this.state.rental);
  },

  render: function () {
    if (this.state.noDetails) { 
      return (
        <div className="booking">
          <h3>Please select a rental.</h3>
        </div>
        );
    } else {
      var formatedPrice = "";
      var rawPrice = String(this.state.rental.price);
      var j;
      for(var i = 1; i <= rawPrice.length; i++) {
        j=rawPrice.length - i;
        if(!(i % 3) && i < rawPrice.length) 
          formatedPrice = "," + rawPrice[j] + formatedPrice;
        else 
          formatedPrice = rawPrice[j] + formatedPrice;
      }
      formatedPrice = "$" + formatedPrice;
      return (
        <div className="booking">
          <h2>{this.state.rental.name}</h2>
          <h3>{this.state.rental.address}</h3>
          <img className="poolImg" src={this.state.rental.imgPath}/> 
          <h3>{new Date(this.state.rental.date).toDateString().slice(4)}</h3>
          <h4>{formatedPrice}</h4>
          <button onClick={this.handleBooking}>Book now</button>
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
      <div>
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

  componentDidMount: function () {
    this.initializeMap();
    RentStore.addEntryClickedListener(this.handleEntryClicked);
  },

  componentWillUnmount: function () {
    RentStore.removeEntryClickedListener(this.handleEntryClicked);
  },

  handleEntryClicked: function (load) {
    this.codeAddress(load.address);
  },

  codeAddress: function (address) {
    if (this.oldMarker) this.oldMarker.setMap(null);
    this.geocoder.geocode( { 'address': address}, function(results, status) {
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

