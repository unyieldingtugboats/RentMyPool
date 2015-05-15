

$.Velocity.RegisterUI("slideFadeIn", {
    defaultDuration: 100,
    calls: [[{
      opacity: [1, 0],
      scaleY: [1, 0.3],
      scaleX: [1, 0.3],
    }]]
});

$.Velocity.RegisterUI("slideInTop", {
    defaultDuration: 100,
    calls: [[{
      opacity: [1, 0],
      translateY: [0, -30],
    }]]
});

$.Velocity.RegisterUI("slideInLeft", {
    defaultDuration: 100,
    calls: [[{
      opacity: [1, 0],
      translateX: [0, 30],
    }]]
});

var DropdownItem = React.createClass({
  getInitialState: function() {
    return {
      selected: false,
      classState: ''
    }
  },

  handleClick : function() {
    console.log('you clicked an item from inside dropdown item and it was: ', this.props.name);
    if (!this.state.selected){
      this.setState({
        selected: true,
        classState: 'selected'
      })
      ListingsActions.poolTypeAdded(this.props.name);
    } else {
      console.log('you already selected that!');
      this.setState({
        selected: false,
        classState: ''
      })
      ListingsActions.poolTypeRemoved(this.props.name);
    }
  },

  render: function() {
    var classes = classNames("dropdown-item", this.state.classState);
    return (
      <li className={classes} onClick={this.handleClick}>{this.props.name}</li>
    );
  }
});



var DropdownItems = React.createClass({

  getDefaultProps: function() {
    return {
      items: ['Diving Board', 
                   'Hot Tub', 
               'Water Slide', 
              'Above Ground',
                    'Heated', 
                'Salt Water',
                  'Chlorine']
    }
  },

  render: function() {
    var items = this.props.items.map(function(item, i) {
      return (<DropdownItem name={item} key={i} />);
    }.bind(this))
    return (
      <ul className="dropdown-items">
        {items}
      </ul>
    );
  }
});

var DropdownMenu = React.createClass({

  componentWillUpdate: function(nextProps, nextState) {
    if (nextProps.visibility) {
      $('.dropdown-menu').velocity("slideFadeIn", {position:'absolute',easing: 'ease-in', duration: 75});
      $('.dropdown-menu .dropdown-item').velocity("slideInTop", {
        stagger: 30,
        duration: 250,
        easing: [0.610, 0.870, 0.710, 1.000],
      });
    } else {
      $('.dropdown-menu').velocity("reverse", {display: 'none'});
      $('.dropdown-menu .dropdown-item').velocity("reverse");
    }
  },

  render: function() {
    return (
      <div className="dropdown-menu">
        <DropdownItems />
      </div>
    );
  }
});

var Icon = React.createClass({

  getDefaultProps: function() {
    return {
      fill: '#434343'
    }
  },

  render: function() {
    if (this.props.type === "options") {
      return (
        <div className="icon icon-options" onClick={this.props.handleClick}>
          <svg viewBox="0 0 24 24" height="100%" width="100%">
            <g>
              <path d="M12,8c1.1,0,2-0.9,2-2s-0.9-2-2-2c-1.1,0-2,0.9-2,2S10.9,8,12,8z M12,10c-1.1,0-2,0.9-2,2s0.9,2,2,2c1.1,0,2-0.9,2-2S13.1,10,12,10z M12,16c-1.1,0-2,0.9-2,2s0.9,2,2,2c1.1,0,2-0.9,2-2S13.1,16,12,16z" fill={this.props.fill}></path>
            </g>
          </svg>
        </div>
      );
    }
  }
});


var DropdownClass = React.createClass({

  getInitialState: function() {
    return {
      dropdownVisible: false,
    }
  },

  dropdownToggle: function() {
    this.setState({
      dropdownVisible: !this.state.dropdownVisible
    })
  },

  render: function() {
    return (
      <div className="main-wrapper">
        <div className="header"> Pool Type Selector
          <div className="header-inner">
            <Icon type="options" fill="#ffffff" handleClick={this.dropdownToggle}/>
          </div>
        </div>
        <DropdownMenu visibility={this.state.dropdownVisible} />
      </div>
    );
  }
});



