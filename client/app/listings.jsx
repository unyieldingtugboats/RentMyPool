var ListContent = React.createClass({

  getInitialState: function() {
  return {
    name: 'Name',
    address : 'Address',
    price : 'Price',
    date: "Date",
    user_id: ""
    };
  },

  componentWillMount: function () {
    AppStore.addFetchUserListener(this.handleFetchUser);
  },

  componentDidMount: function () {
    $( "#datepicker" ).datepicker();
    AppActions.fetchUser();
  },

  componentWillUnmount: function () {
    AppStore.removeFetchUserListener(this.handleFetchUser);
  },

  handleFetchUser: function (data) {
    this.setState({
      user_id: data._id
    });
  },

  handleSubmit: function (e) {
    e.preventDefault();

    this.setState({
      name: e.target.name.value,
      address: e.target.address.value,
      price: e.target.price.value,
      date: e.target.date.value
    }, 
      function () {
        ListingsActions.listingSubmitted(this.state);
      }.bind(this)
    );
  },

  render: function () {
    return (
      <div className="listView">
        <LoginTransitioner />
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
          <input name="date" id="datepicker" placeholder={this.state.date} type="text" />
          <br />
          <br />
          <input type="file" name="file" />
          <input type="submit" />
        </form>
      </div>
    );
  }

});
