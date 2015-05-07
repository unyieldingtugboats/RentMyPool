var Listings = React.createClass({


  render: function () {
    var cb = this.props.cb;
    console.log(this.props.data);
    var listItems = this.props.data.map(function (item, index) {
      return (
        <div className="listEntry" onClick={cb.updateDetails.bind(cb,item)}>
        {item.name +' - ' + item.address + ' - ' + item.price}
        </div>
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
    console.log('chah');
    var state = {};
    state[event.target.name] = event.target.value;
    this.setState(state);
  },

  handleSearch: function() {
    console.log('refresh');
    this.props.cb.refreshResults(this.state.date, this.state.location);

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
    };
  },

  handleBooking: function() {
    console.log('booking');
    var self = this;
    $.ajax({
      url: "/book",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify({date : this.props.date, _id : this.props.rental.item._id}),
      statusCode: {
        302: function (data) {
          self.transitionTo(data.responseText);
        },
        error: function (err) {
          console.log("Error:", err)
        }
      }
    });
  },

  render: function () {
    if (this.props.rental.noDetails) { 
      return (
        <div className="booking">
          <h3>Please select a rental.</h3>
        </div>
        );
    } else {
      return (
        <div className="booking">
          <h3>{this.props.date}</h3>
          <h4>{this.props.rental.item.price}</h4>
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
      date: '',
      rental : { noDetails : true, cls : 'noShow' }
    };
  },

  

  refreshResults: function (date,location) {
    $.get("/rentItems?date="+date+"&location="+location, function (data) {
      console.log("GET Success");
      console.dir(data.results);
      this.setState({data:data.results, date:date});
    }.bind(this));
  },

  updateDetails: function (item) {
    codeAddress(item.address, item._id);
    this.setState({rental:{ noDetails : false, cls : '', item : item}});
  },

  changeDate: function (date) {
    this.refreshResults(date,'San Francisco');  
  },

  componentDidMount: function () {
    initializeMap();
    $( "#datepicker" ).datepicker({
      onSelect : this.changeDate.bind(this)
    });
    //refreshResults();
  },
  
  render: function () {
    
    return (
      <div>
        <h1>Rent a Pool</h1>
        <Filter cb={this}/>
        <div className="showRents">
          <div className="showList">
            <Listings data={this.state.data} cb={this} />
          </div>
          <div className="showDetails">
            <Booking date={this.state.date} rental={this.state.rental}/>
            <div className = {this.state.rental.cls} id="map-canvas"></div>
          </div>
        </div>
      </div>
    );
  }
});




var geocoder;
var map;
var oldMarker;

function initializeMap(address) {
  geocoder = new google.maps.Geocoder();
  var latlng = new google.maps.LatLng(37.783551, -122.408990);
  var mapOptions = {
    zoom: 14,
    center: latlng
  }
  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
}

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
