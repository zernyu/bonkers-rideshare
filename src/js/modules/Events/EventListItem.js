var moment = require('moment');
var React = require('react/addons');
var AddEventModal = require('./AddEventModal');
var EventModal = require('./EventModal');

var EventListItem = React.createClass({
  openEvent: function () {
    React.render(<EventModal event={this.props.data} />, document.getElementById('eventModal'));
  },

  editEvent: function (e) {
    if (this.props.editEnabled) {
      e.stopPropagation();
      React.render(<AddEventModal event={this.props.data}/>, document.getElementById('eventModal'));
    }
  },

  render: function () {
    return (
        <a className="event item" onClick={this.openEvent}>
          <i className="right floated large setting icon" onClick={this.editEvent}></i>
          <div className="header">{this.props.data.name}</div>
          <span className="subtitle">{moment(this.props.data.date).format('dddd, MMMM Do YYYY')}</span>
        </a>
    );
  }
});

module.exports = EventListItem;