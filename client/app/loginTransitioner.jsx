var LoginTransitioner = React.createClass({

  mixins: [ReactRouter.Navigation],

  componentDidMount: function () {
    AppStore.addFetchUserListener(this.handleFetchUser);
    AppActions.fetchUser();
  },

  componentWillUnmount: function () {
    AppStore.removeFetchUserListener();
  },

  handleFetchUser: function (user) {
    if(!user)
      this.transitionTo("Login");
  },

  render: function () {
    return (
      <div style={{visibility: "hidden"}}>
        THIS IS HIDDEN!!!
      </div>
    );
  }

});