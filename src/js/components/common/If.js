var React = require('react/addons');

/**
 * Conditional element rendering helper
 */
var If = React.createClass({
  render: function () {
    if (this.props.test) {
      return this.props.children;
    }
    else {
      return false;
    }
  }
});

module.exports = If;