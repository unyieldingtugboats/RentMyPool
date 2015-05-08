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

  handleNewEntries: function (data) {
    this.setState({data: data});
  },

  handleFilterChange: function (data) {
    var newEntries =  this.state.allData.filter(function (item, index) {
      if(data.date && !data.location) {
        if(item.date && item.date.includes(data.date))
          return true;
      }
      else if (data.date && data.location) {
        if(item.date && item.date.includes(data.date) && item.address.includes(data.location))
          return true;
      }
      else if (!data.date && data.location) {
        if(item.address.includes(data.location))
          return true;
      }
      else {
        return true;
      }
    });

    this.handleNewEntries(newEntries);
  },

  refreshResults: function (data) {
    this.setState({allData: data});
    this.handleNewEntries(data);
  },

  render: function () {
    var listItems = this.state.data.map(function (item, index) {
      return (
        <ListEntry key={index} date={item.date} name={item.name} address={item.address} price={item.price} />
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
          <h3>{new Date(this.state.rental.date).toDateString().slice(4)}</h3>
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

