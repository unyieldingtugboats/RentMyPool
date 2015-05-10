
var SignUpContent = React.createClass({

  mixins:[ReactRouter.Navigation],

  getInitialState: function () {
    return {
      username: "Username",
      password: "Password"
    };  
  },

  handleSubmit: function (e) {
    e.preventDefault();
    var self = this;

    this.setState({
      username: e.target.username.value,
      password: e.target.password.value
    },
      function () {
        $.ajax({
          url: "/signup",
          method: "POST",
          contentType: "application/json",
          data: JSON.stringify(self.state),
          statusCode: {
            302: function (data) {
              self.transitionTo(data.responseText);
            }
          }
        });
      }
    );
  },

  render: function () {
    return (
      <div className="signUp">
        <h1>Sign Up</h1>
        <br />
        <form onSubmit={this.handleSubmit}>
          <input name="username" placeholder={this.state.username} onChange={this.handleChange} />
          <br />
          <br />
          <input type="password" name="password" placeholder={this.state.password} onChange={this.handleChange} />
          <br />
          <br />
          <input type="submit" value="Sign Up" />
        </form>
      </div>
    );
  }
});