var ListContent = React.createClass({

  getInitialState: function() {
  return {
    name: 'Name',
    address : 'Address',
    price : 'Price'
    };
  },

  handleSubmit: function (e) {
    e.preventDefault();

    this.setState({
      name: e.target.name.value,
      address: e.target.address.value,
      price: e.target.price.value
    }, 
      function () {
        ListingsActions.listingSubmitted(this.state);
      }.bind(this)
    );
  },

  render: function () {
    return (
      <div className="listView">
        <h1>List a Pool</h1>
        <form onSubmit={this.handleSubmit}>
          <input name="name" placeholder={this.state.name} type="text" />
          <br />
          <br />
          <input name="address" placeholder={this.state.address} type="text" />
          <br />
          <br />
          <input name="price" placeholder={this.state.price} type="text" />
          <br />
          <br />
          <input type="submit" />
        </form>
      </div>
    );
  }

});
