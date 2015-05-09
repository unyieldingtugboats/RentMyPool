var Route = ReactRouter.Route;
var DefaultRoute = ReactRouter.DefaultRoute;
var RouteHandler = ReactRouter.RouteHandler;
var Link = ReactRouter.Link;

var UserButton = React.createClass({

  render: function () {
    if(this.props.user)
      return (
        <span> 
        {"Logged in as " + this.props.user.username}
        </span>
      );
    else 
      return(
        <span>
          {"Not Logged In."}
        </span>
      );
  }

});

var UserDetails = React.createClass({

  render: function () {
    return (
      <div className="userDetailsContainer">
        <div className={this.props.show ? "userDetails show" : "userDetails"}>
          <h1>{this.props.user.username}</h1>
          <h2>Listings</h2>
        </div>
      </div>
    );
  }

});

var CurrentUser = React.createClass({

  getInitialState: function () {
    return {
      showDetails: false
    }
  },

  handleClick: function () {
    if(this.props.user)
      this.setState({
        showDetails: !this.state.showDetails
      });
  },

  render: function () {
      return (
        <div  onClick={this.handleClick} className="currentUser">
          <UserButton user={this.props.user} />
          <UserDetails show={this.state.showDetails} user={this.props.user || {}} />
        </div>
      );
  }

});

var Navigation = React.createClass({

  getInitialState: function(){
      return { 
        user: null
      };
  },

  componentWillMount: function () {
    AppStore.addUserLoginListener(this.handleNewUser);
  },

  handleNewUser: function (data) {
    this.setState({
      user: data
    });
  },

  render: function () {
    return (
      <div className="nav-menu">
        { this.props.items.map(function(m, index){
            return <Link key={index} activeClassName="nav-link-focused" className="nav-link" to={m.name}>{m.name}</Link>;
          }) }
        <CurrentUser user={this.state.user} />
      </div>
    );
  }
});

var Main = React.createClass({

  render: function () {
    return (
      <div className="viewPort">

        <Navigation items={ [
          {name:'Home'},
          {name:'Rent'},
          {name:'List'},
          {name:'Img Upload'},
          {name: 'Login'}
        ] } />
        <div className="main">
          <RouteHandler />
        </div>
      </div>
    );
  }
});

var routing = function () {
  var routes = (
        <Route path="/" handler={Main}>
          <Route name="Home" handler={Content} />
          <Route name="Rent" handler={RentContent} />
          <Route name="List" handler={ListContent} />
          <Route name="Img Upload" handler={ImgUploadContent} />
          <Route name="Login" handler={LoginContent} />
          <Route name="Sign Up" handler={SignUpContent} />
          <Route name="Payment" handler={PaymentContent} />
          <DefaultRoute handler={Content} />
        </Route>
      );

  ReactRouter.run(routes, ReactRouter.HistoryLocation, function (Handler) {
    React.render(<Handler />, $('body')[0]);
  });
};



