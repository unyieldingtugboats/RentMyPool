var createNav = function () {
  var Navigation = React.createClass({

    getInitialState: function(){
        return { focused: 0 };
    },

    clicked: function(index, cb){

        // The click handler will update the state with
        // the index of the focused menu entry

        this.setState({focused: index});
        cb();
    },

    render: function () {

      var self = this;
      return (
        <div className="nav-menu">
          { this.props.items.map(function(m, index){

                    var style = 'nav-link';

                    if(self.state.focused == index){
                        style = 'nav-link-focused';
                    }

                    // Notice the use of the bind() method. It makes the
                    // index available to the clicked function:

                    return <a className={style} onClick={self.clicked.bind(self, index, m.cb)}>{m.name}</a>;

          }) }

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

          <Navigation items={ [
            {name:'Home',cb:renderHome},
            {name:'Rent',cb:renderRent},
            {name:'List',cb:renderList},
            {name:'Img Upload', cb:renderImgUpload}
          ] } />
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
