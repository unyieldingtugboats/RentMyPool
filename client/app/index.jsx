var Content = React.createClass({
    render: function () {
      return (
        <div className="home">
          <h1>Welcome to the Pool Party</h1>
          <div className="introImgDiv">
            <img src="/res/pool1.jpg"/>
          </div>
        </div>
      );
    }

  });


$(function () {
  routing();
});
