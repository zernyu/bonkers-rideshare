var React = require('react/addons');
var EventModal = require('./EventModal');

var Event = React.createClass({
  openEvent: function () {
    React.render(<EventModal event={this.props.data} />, document.getElementById('eventModal'));
  },

  render: function () {
    return (
        <a className="event item" onClick={this.openEvent}>
          <div className="header">{this.props.data.name}</div>
          <span className="subtitle">{this.props.data.date.toDateString()}</span>
        </a>
    );
  }
});

module.exports = Event;