
var SignUpContent = React.createClass({

  getInitialState: function () {
    return {
      username: "Username",
      password: "Password"
    };  
  },

  handleSubmit: function (e) {
    e.preventDefault();
    
    $.ajax({
      url: "/signup",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify(this.state),
      success: function (){
        console.log("POST Successful.");
      },
      error: function (err) {
        console.log("Error:", err)
      }
    });
  },

  handleChange: function (event) {
    var state = {};
    state[event.target.name] = event.target.value;
    this.setState(state);
  },

  render: function () {
    return (
      <div className="signUp">
        <h1>Sign Up</h1>
        <br />
        <form onSubmit={this.handleSubmit}>
          <input name="username" value={this.state.username} onChange={this.handleChange} />
          <br />
          <br />
          <input name="password" value={this.state.password} onChange={this.handleChange} />
          <br />
          <br />
          <input type="submit" value="Sign Up" />
        </form>
      </div>
    );
  }
});