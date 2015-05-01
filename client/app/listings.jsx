var Listings = React.createClass({

  render: function () {

    var listItems = this.props.data.map(function (item, index) {
      return (
        <div className="listEntry">
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
