var testData = [{name : 'John', address : 'San Francisco', price : '1.00'},
  {name : 'David', address : 'Germany', price : '600000000.00'}];

var renderRent = function() {

  var RentContent = React.createClass({

    render: function () {
      return (
        <div>
          <h1>Rent a Pool</h1>
          <Listings data={this.props.data} />
          <div id="map-canvas" style={{width: '500px', height: '300px'}}></div>
        </div>

      );
    }
  });



  $.get("/rent", function (data) {
    console.log(data);
    React.render(<RentContent data={testData} />, $('.main')[0]);
    initializeMap();
   });

}

function initializeMap() {
  geocoder = new google.maps.Geocoder();
  var latlng = new google.maps.LatLng(-34.397, 150.644);
  var mapOptions = {
    zoom: 8,
    center: latlng
  }
  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
}
