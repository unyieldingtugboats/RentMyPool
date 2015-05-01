var renderHome = function() {

  var Content = React.createClass({
    render: function () {
      return (
        <div>
          <h1>Welcome to the Pool Party</h1>
          <div className="introImgDiv">
            <img src="/res/pool1.jpg"/>
          </div>
        </div>
      );
    }

  });

  React.render(<Content />, $('.main')[0]);
}

$(function () {
  createNav();
  renderHome();
});
