$(function () {
  var Navigation = React.createClass({
    render: function () {
      return (
        <div className="navigation">
          <a href="app/rent.html">Rent a Pool</a>
          <a href="app/list.html">List a Pool</a>
        </div>
      );
    }
  });


  var Header = React.createClass({
    render: function () {
      return (
        <h1>Rent a Pool</h1>
      );
    }

  });

  var Main = React.createClass({
    render: function () {
      return (
        <div className="main">
          <Header />
          <Navigation />
        </div>
      );
    }

  });

  React.render(<Main />, $('body')[0]);

});
