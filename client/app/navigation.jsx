var createNav = function () {
  var Navigation = React.createClass({
    render: function () {
      return (
        <div className="nav-menu">
          <a className="nav-link" href="javascript:renderHome()">Home</a>
          <a className="nav-link" href="javascript:renderRent()">Rent a Pool</a>
          <a className="nav-link" href="javascript:renderList()">List a Pool</a>
        </div>
      );
    }
  });


  // var Header = React.createClass({
  //   render: function () {
  //     return (
  //       <h1>Rent a Pool</h1>
  //     );
  //   }

  // });

  var Main = React.createClass({
    render: function () {
      return (
        <div className="viewPort">

          <Navigation />
          <div className="main">
          </div>
        </div>
      );
    }

  });

  React.render(<Main />, $('body')[0]);

};

var goRent = function() {
  console.log('goRent');
}
