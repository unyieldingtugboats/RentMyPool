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
    var $form = $("#listingForm")[0];

    this.setState({
      name: $form.name.value,
      address: $form.address.value,
      price: $form.price.value,
      date: $form.date.value,
      file: $form.userPhoto.files[0]
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
        <form id="listingForm">
          <input className="listingInput" name="name" placeholder={this.state.name} type="text" />
          <br />
          <br />
          <input className="listingInput" name="address" placeholder={this.state.address} type="text" />
          <br />
          <br />
          <input className="listingInput" name="price" placeholder={this.state.price} type="text" />
          <br />
          <br />
          <input className="listingInput" name="date" id="datepicker" placeholder={this.state.date} type="text" />
          <br />
          <br />
          <input type="file" id="userPhotoInput" name="userPhoto" />
          <br />
          <br />
          <a className="btn-link" onClick={this.handleSubmit}>List</a>
        </form>
      </div>
    );
  }

});
