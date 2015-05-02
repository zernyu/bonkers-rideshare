var moment = require('moment');
var React = require('react/addons');
var AddEventModal = require('./AddEventModal');
var EventModal = require('./EventModal');
var classNames = require('classnames');

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
    var eventDate = moment(this.props.data.date);
    return (
        <a className={classNames('event item', {past: eventDate.isBefore()})} onClick={this.openEvent}>
          <i className="right floated large setting icon" onClick={this.editEvent}></i>
          <div className="header">{this.props.data.name}</div>
          <span className="subtitle">{eventDate.format('dddd, MMMM Do YYYY')}</span>
        </a>
    );
  }
});

module.exports = EventListItem;