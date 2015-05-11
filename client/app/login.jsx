var LoginContent = React.createClass({

  mixins: [ReactRouter.Navigation],

  getInitialState: function () {
    return {
      username: "Username",
      password: "Password"
    };  
  },

  componentWillMount: function () {
    AppStore.addUserLoginListener(this.handleUserLogin);
  },

  componentWillUnount: function () {
    AppStore.removeUserLoginListener(this.handleUserLogin);
  },

  handleUserLogin: function () {
    this.transitionTo("Home");
  },

  handleSubmit: function (e) {
    e.preventDefault();

    this.setState({
      username: e.target.username.value,
      password: e.target.password.value
    },
      function () {
        AppActions.userLogin(this.state);
      }
    );    
  },

  render: function () {
    return (
      <div className="login">
        <h1>Login</h1>
        <br />
        <form onSubmit={this.handleSubmit}>
          <input name="username" placeholder={this.state.username} onChange={this.handleChange} />
          <br />
          <br />
          <input type="password" name="password" placeholder={this.state.password} onChange={this.handleChange} />
          <br /> 
          <br />
          <input type="submit" value="Login"/>
          <Link to="Sign Up">Sign Up</Link>
        </form>
      </div>
    );
  }
});