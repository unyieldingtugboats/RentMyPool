var ListContent = React.createClass({

  mixins: [ReactRouter.Navigation],

  getInitialState: function() {
  return {
    name: 'Name',
    address : 'Address',
    price : 'Price (per hour)',
    date: "Date",
    poolType: [],
    user_id: "",
    error: ""
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

    if ($form.name.value && $form.address.value && $form.price.value && $form.date.value && $form.userPhoto.files[0]) {
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
    } else {
      this.setState({
        error: "Please enter values for required fields"
      })
    }
  },

  render: function () {
    return (
      <div className="listView">
        <LoginTransitioner />
        <h1>List a Pool</h1>
        <form id="listingForm">
          <div className="listingInput">
            <DropdownClass  />   
          </div>  
          <br />
          <input className="listingInput" name="poolType" placeholder="Select a pool type" value={this.state.poolType} type="text" />
          <br />
          <br />
          <input className="listingInput" name="name" placeholder={this.state.name+'*'} type="text" />
          <br />
          <br />
          <input className="listingInput" name="address" placeholder={this.state.address+'*'} type="text" />
          <br />
          <br />
          <input className="listingInput" name="price" placeholder={this.state.price+'*'} type="text" />
          <br />
          <br />
          <input className="listingInput" name="date" id="datepicker" placeholder={this.state.date+'*'} type="text" />
          <br />
          <br />
          <div className="listingInput">*
            <input type="file" id="userPhotoInput" name="userPhoto" />
          </div>
          <div>
            * required field
          </div>
          <div className="listingInput">
            <a className="btn-link" onClick={this.handleSubmit}>List</a>
          </div>
          <br />
          <div className="error">
            {this.state.error}
          </div>
        </form>
      </div>
    );
  }

});
