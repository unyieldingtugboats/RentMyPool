// LoginTransitioner prevents non-logged-in users from seeing content
// by redirecting them if they aren't logged in.
// LoginTransitioner is a component that is put inside of the render 
// function of components that we only want to render when a user is
// logged in. 

// For example, if we only wanted logged-in users to view the page that 
// allows you to post your pool listing, we would just insert
// a <LoginTransitioner /> tag into the render function of the component
// that is responsible for rendering the part that allows you to post your
// listing. Inserting the <LoginTransitioner /> tag into the render function
// will make it so that if the user is not logged in, the page will be
// redirected to the Login page.

// mixins: [ReactRouter.Navigation]
// Adding this mixin gives LoginTransitioner access to the transitionTo 
// function, which allows us to navigate the user to a different url.

// componentDidMount
// This is called after the <LoginTransitioner /> tag is mounted.
// The <LoginTransitioner /> tag is mounted whenever a render function 
// in a component that has a <LoginTransitioner /> tag inside of it is 
// called. Calling this function when a particular component is rendered
// prevents unlogged-in users from seeing the content of that page.

// handleFetchUser
// Helper function that makes sure the user is logged in. 
// If they aren't logged in, they get redirected to the Login page.

// this.transitionTo
// This function is a part of the ReactRouter.Navigation mixin.
// Takes a string argument, then searches for a component that matches
// the string that was passed in with the route that has the same name.
// Routes are defined in navigation.jsx:
// ... <Route name="Login" handler={LoginContent} /> ...
// Calling this.transitionTo('Login') will make cause a name search until  
// the route with name="Login" is found, which will render its handler, 
// which happens to be LoginContent, in this example.

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