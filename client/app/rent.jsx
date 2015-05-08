var ListEntry = React.createClass({

  handleClick: function () {
    RentActions.entryClicked(this.props);
  },

  render: function () {
    return (
      <div className="listEntry" onClick={this.handleClick}>
        {this.props.name +' - ' + this.props.address + ' - ' + this.props.price + ' - ' + this.props.date}
      </div>
    );
  }

});

var Listings = React.createClass({

  getInitialState: function () {
    return {
      data: []
    };
  },

  componentWillMount: function () {
    RentStore.addFetchEntriesListener(function (data) {
      this.setState({data: data.results});
    }.bind(this));

    this.refreshResults({
      date: "",
      location: ""
    })
  },

  refreshResults: function (date, location) {
    RentActions.fetchEntries({
      date: date,
      location: location
    });
  },

  render: function () {
    var listItems = this.state.data.map(function (item, index) {
      return (
        <ListEntry date={item.date} name={item.name} address={item.address} price={item.price} />
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
      date: 'Date',
      location : 'Location',
    };
  },

  handleChange: function(event) {
    console.log('change');
    var state = {};
    state[event.target.name] = event.target.value;
    this.setState(state);
  },

  handleSearch: function() {
    RentActions.fetchEntries({
      date: this.state.date,
      location: this.state.location
    });
  },

  render: function () {

    return (
      <div className="filter">
        <input type="text" id="datepicker" name="date" value={this.state.date} onChange={this.handleChange}/>
        <input type="text" name="location" value={this.state.location} onChange={this.handleChange}/>
        <button onClick={this.handleSearch}>Search</button>
      </div>
    );
  }
});

var Booking = React.createClass({
  
  mixins: [ReactRouter.Navigation],

  getInitialState: function() {
    return {
      noDetails: true,
      rental: {}
    };
  },

  componentWillMount: function () {
    RentStore.addEntryClickedListener(function (load) {
      this.setState({
        noDetails: false,
        rental: load
      });
    }.bind(this));
  },

  handleBooking: function() {
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
      return (
        <div className="booking">
          <h2>{this.state.rental.name}</h2>
          <h3>{this.state.rental.address}</h3>
          <h3>{this.state.rental.date}</h3>
          <h4>{this.state.rental.price}</h4>
          <button onClick={this.handleBooking}>Book now</button>
        </div>
      );
    }
  }
});


var RentContent = React.createClass({

  getInitialState: function () {
    return {
      data: [],
      date: ''
    };
  },

  componentDidMount: function () {
    $( "#datepicker" ).datepicker({
      onSelect : {}
    });
  },
  
  render: function () {
    
    return (
      <div>
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
    RentStore.addEntryClickedListener(function (load) {
      this.codeAddress(load.address);
    }.bind(this));
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

