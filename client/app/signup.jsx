
var SignUpContent = React.createClass({

  mixins:[ReactRouter.Navigation],

  getInitialState: function () {
    return {
      username: "Username",
      password: "Password"
    };  
  },

  handleSubmit: function (e) {
    var $form = $('#signUpForm')[0];
    var self = this;

    this.setState({
      username: $form.username.value,
      password: $form.password.value
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
      <div className="login">
        <h1>Sign Up</h1>
        <br />
        <form id="signUpForm">
          <input className="loginInput" name="username" placeholder={this.state.username} onChange={this.handleChange} />
          <br />
          <br />
          <input className="loginInput" type="password" name="password" placeholder={this.state.password} onChange={this.handleChange} />
          <br />
          <br />
          <a className="btn-link" onClick={this.handleSubmit}>Sign Up</a>
        </form>
      </div>
    );
  }
});