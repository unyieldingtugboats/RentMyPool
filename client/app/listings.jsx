var ListContent = React.createClass({

  mixins: [ReactRouter.Navigation],

  getInitialState: function() {
  return {
    name: 'Name',
    address : 'Address',
    price : 'Price',
    date: "Date",
    poolType: [],
    user_id: ""
    };
  },

  componentWillMount: function () {
    AppStore.addFetchUserListener(this.handleFetchUser);
    ListingsStore.addPoolTypeAddListener(this.handlePoolTypeAdd);
    ListingsStore.addPoolTypeRemoveListener(this.handlePoolTypeRemove);
    ListingsStore.addListingSubmittedListener(this.handleListingSubmitted);
  },

  componentDidMount: function () {
    $( "#datepicker" ).datepicker();
    AppActions.fetchUser();
  },

  componentWillUnmount: function () {
    AppStore.removeFetchUserListener(this.handleFetchUser);
    ListingsStore.removeListingSubmittedListener(this.handleListingSubmitted);
  },

  handleListingSubmitted: function () {
    this.transitionTo("Rent");
  },

  handlePoolTypeAdd: function (data) {
    this.setState({ 
    poolType: this.state.poolType.concat([data])
    }, function(){
      console.log('state: ', this.state.poolType);
    })
  },

  handlePoolTypeRemove: function(data) {
    var newTypeList = this.state.poolType.filter(function(type){
      return type !== data; 
    });
    this.setState({
      poolType: newTypeList
    }, function(){
      console.log('new state: ', this.state.poolType);
    });
  },

  handleFetchUser: function (data) {
    this.setState({
      user_id: data._id
    });
  },

  handleSubmit: function (e) {
    var $form = $("#listingForm")[0];
    //get the props off of the dropdown component 

    this.setState({
      name: $form.name.value,
      address: $form.address.value,
      price: $form.price.value,
      date: $form.date.value,
      // poolType: $form.poolType.value, //this is going to be an array of items selected from the dropdown
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
          <DropdownClass  />   
          <br />
          <input className="listingInput" name="poolType" placeholder="Select a pool type" value={this.state.poolType} type="text" />
          <br />
          <br />
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
