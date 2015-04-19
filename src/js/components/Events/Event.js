var moment = require('moment');
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
          <span className="subtitle">{moment(this.props.data.date).format('dddd, MMMM Do YYYY')}</span>
        </a>
    );
  }
});

module.exports = Event;