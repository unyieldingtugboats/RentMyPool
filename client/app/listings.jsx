var renderList = function () {
  var ListContent = React.createClass({

    getInitialState: function() {
    return {
      name: 'Name',
      address : 'Address',
      price : 'Price'
      };
    },

    handleChange: function(event) {
      var state = {};
      state[event.target.name] = event.target.value;
      this.setState(state);
    },

    render: function () {
      return (
        <div className="listView">
          <h1>List a Pool</h1>
          <form method="POST" action="/list">
            <input name="name" value={this.state.name} onChange={this.handleChange}  type="text" />
            <br />
            <br />
            <input name="address" value={this.state.address} onChange={this.handleChange}  type="text" />
            <br />
            <br />
            <input name="price" value={this.state.price} onChange={this.handleChange}  type="text" />
            <br />
            <br />
            <input type="submit" />
          </form>
        </div>
      );
    }

  });

  React.render(<ListContent />, $('.main')[0]);
};
