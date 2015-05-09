var moment = require('moment');
var React = require('react/addons');
var AddEventModal = require('./AddEventModal');
var EventModal = require('./EventModal');
var If = require('../common/If');
var classNames = require('classnames');

var dateFormat = 'dddd, MMMM Do YYYY';

var EventListItem = React.createClass({
  openEvent: function () {
    React.render(<EventModal event={this.props.event} />, document.getElementById('eventModal'));
  },

  editEvent: function (e) {
    if (this.props.editEnabled) {
      e.stopPropagation();
      React.render(<AddEventModal event={this.props.event}/>, document.getElementById('eventModal'));
    }
  },

  render: function () {
    var eventDate = moment(this.props.event.date);
    var eventDateString;
    if (!this.props.event.endDate) {
      eventDateString = eventDate.format(dateFormat);
    } else {
      eventDateString = eventDate.format(dateFormat) + ' - ' + moment(this.props.event.endDate).format(dateFormat);
    }

    return (
        <a className={classNames('event item', {past: eventDate.isBefore(moment().add(1, 'day'))})} onClick={this.openEvent}>
          <i className="right floated large setting icon" onClick={this.editEvent}></i>
          <div className="header">
            <If test={this.props.event.series}>
              <span className="event series">{this.props.event.series}</span>
            </If>
            {this.props.event.name}
          </div>
          <span className="subtitle">{eventDateString}</span>
        </a>
    );
  }
});

module.exports = EventListItem;
