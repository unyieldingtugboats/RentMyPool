var addListings = function (data) {
  var $ul = $('#listings');

    for(var i = 0; i < data.length; i++) {
      var $li = $('<li></li>');
      $li.html(data[i].name +' - ' + data[i].address + ' - ' + data[i].price);
      $ul.append($li);
    }
}

var testData = [{name : 'John', address : 'San Francisco', price : '1.00'},
  {name : 'David', address : 'Germany', price : '600000000.00'}];

var renderRent = function() {

  var RentContent = React.createClass({
    render: function () {
      return (
        <div>
          <h1>Rent a Pool</h1>
          <ul id="listings">
          </ul>
        </div>

      );
    }

  });



  React.render(<RentContent />, $('.main')[0]);
  $.get("/rent", function (data) {
    console.log(data);
    addListings(data.results);
   });

}

var renderList = function () {
  var ListContent = React.createClass({
    render: function () {
      return (
        <div className="listView">
          <h1>List a Pool</h1>
          <form method="POST" action="/list">
            <input name="name" value="Name" type="text" />
            <br />
            <br />
            <input name="address" value="Address" type="text" />
            <br />
            <br />
            <input name="price" value="Price" type="text" />
            <br />
            <br />
            <input type="submit" />
          </form>
        </div>
      );
    }

  });

  React.render(<ListContent />, $('.main')[0]);
};

var renderHome = function() {

  var Content = React.createClass({
    render: function () {
      return (
        <div>
          <h1>Welcome to the Pool Party</h1>
          <div className="introImgDiv">
            <img src="/res/pool1.jpg"/>
          </div>
        </div>
      );
    }

  });


  React.render(<Content />, $('.main')[0]);

}




$(function () {

  createNav();
  renderHome();




});
