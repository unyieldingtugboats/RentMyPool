var bookingDate = 'test';
var bookingID = '';

var ListEntry = React.createClass({

  handleClick: function () {
    codeAddress(this.props.address);
  },

  render: function () {
    return (
      <div className="listEntry" onClick={this.handleClick}>
        {this.props.name +' - ' + this.props.address + ' - ' + this.props.price}
      </div>
    );
  }
});

var Listings = React.createClass({

  render: function () {

    var listItems = this.props.data.map(function (item, index) {
      return (
        <ListEntry name={item.name} address={item.address} price={item.price} />
      );
    }, this);

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

  handleSearch: function(e) {
    e.preventDefault();
    console.log('refresh');
    this.setState({
      date: e.target.date.value,
      location: e.target.location.value
    }, function () {
      this.props.cb(this.state.date, this.state.location);
      bookingDate = this.state.date;
    });
  },

  render: function () {

    return (
      <div className="filter">
        <form onSubmit={this.handleSearch}>
          <input type="text" name="date" placeholder={this.state.date} />
          <input type="text" name="location" placeholder={this.state.location} />
          <input type="submit" value="Search" />
        </form>
      </div>
    );
  }
});

var Booking = React.createClass({

  getInitialState: function() {
  return {
    };
  },

  handleChangedleBooking: function() {
    console.log('booking');
    $.ajax({
      url: "/book",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify({date : this.props.date, _id : bookingID}),
      success: function (){
        console.log("POST Successful.");
      },
      error: function (err) {
        console.log("Error:", err)
      }
    });
  },

  render: function () {
    return (
      <div className="booking">
        <h3>{this.props.date}</h3>
        <button onClick={this.handleBooking}>Book now</button>
      </div>
    );
  }
});


var RentContent = React.createClass({

  getInitialState: function () {
    return {
      data: [],
      date: bookingDate
    };
  },

  refreshResults: function (date,location) {
    $.get("/rentItems?date="+date+"&location="+location, function (data) {
      console.log("GET Success");
      console.dir(data.results);
      this.setState({data:data.results, date:date});
    }.bind(this));
  },

  componentDidMount: function () {
    this.refreshResults();
  },
  
  render: function () {
    
    return (
      <div>
        <h1>Rent a Pool</h1>
        <Filter cb={this.refreshResults}/>
        <Listings data={this.state.data} />
        <GoogleMap />
        <Booking date={this.state.date}/>
      </div>
    );
  }
});

var geocoder;
var map;
var oldMarker;

var GoogleMap = React.createClass({

  componentDidMount: function () {
    this.initializeMap();
  },

  initializeMap: function () {
    geocoder = new google.maps.Geocoder();
    var latlng = new google.maps.LatLng(-34.397, 150.644);
    var mapOptions = {
      zoom: 14,
      center: latlng
    }
    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
  },

  render: function () {
    return (
      <div id="map-canvas"></div>
    );
  }

});

function codeAddress(address, id) {
  bookingID = id;
  if (oldMarker) oldMarker.setMap(null);
  geocoder.geocode( { 'address': address}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      map.setCenter(results[0].geometry.location);
      var marker = new google.maps.Marker({
          map: map,
          position: results[0].geometry.location
      });
      oldMarker = marker;
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}
