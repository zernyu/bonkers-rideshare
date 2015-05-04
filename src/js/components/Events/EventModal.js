var _ = require('underscore');
var moment = require('moment');
var React = require('react/addons');
var classNames = require('classnames');
var If = require('../common/If');
var AttendeeList = require('../Attendees/AttendeeList');
var AddAttendeeModal = require('../Attendees/AddAttendeeModal');

var dateFormat = 'dddd, MMMM Do YYYY';

var EventModal = React.createClass({
  closeModal: function () {
    React.unmountComponentAtNode(this.getDOMNode().parentNode);
  },

  toggleView: function (switchTo) {
    this.setState({
      currentView: switchTo
    });
  },

  editAttendee: function (attendee) {
    React.render(
        <AddAttendeeModal eventId={this.props.event.objectId}
                          attendee={_.clone(attendee) || {}}
                          housingNeeded={this.props.event.housingNeeded}/>,
        document.getElementById('attendeeModal')
    );
  },

  getInitialState: function () {
    return {
      currentView: 'racing'
    };
  },

  render: function () {
    var currentView = this.state.currentView;
    var housingNeeded = this.props.event.housingNeeded;

    var toggleButtonClasses = classNames('ui fluid attached full width buttons', {two: !housingNeeded, three: housingNeeded});
    var racingToggleClasses = classNames('ui button', {'positive active': currentView === 'racing'});
    var transportationToggleClasses = classNames('ui button', {'positive active': currentView === 'transportation'});
    var housingToggleClasses = classNames('ui button', {'positive active': currentView === 'housing', hidden: !housingNeeded});

    var registerLink = '';
    if (this.props.event.registrationUrl) {
      registerLink = <a className="registration"
                        href={this.props.event.registrationUrl}
                        target="_blank">Event website <i className="small external icon"></i></a>;
    }

    var eventDate = moment(this.props.event.date);
    var eventDateString;
    if (!this.props.event.endDate) {
      eventDateString = eventDate.format(dateFormat);
    } else {
      eventDateString = eventDate.format(dateFormat) + ' - ' + moment(this.props.event.endDate).format(dateFormat);
    }

    return (
        <div className="ui scrollable page dimmer transition visible animating fade in">
          <div className="event content">
            <div className="ui basic segment">
              <div className="ui top attached segment">
                <h2 className="ui header">{this.props.event.name}
                  <div className="sub header">{eventDateString}</div>
                </h2>
                {registerLink}
                <i className="remove circle icon" onClick={this.closeModal}></i>
              </div>
              <div className={toggleButtonClasses}>
                <div className={racingToggleClasses}
                     onClick={this.toggleView.bind(this, 'racing')}>Racing
                </div>
                <div className={transportationToggleClasses}
                     onClick={this.toggleView.bind(this, 'transportation')}>Transportation
                </div>
                <div className={housingToggleClasses}
                     onClick={this.toggleView.bind(this, 'housing')}>Housing</div>
              </div>
              <AttendeeList eventId={this.props.event.objectId}
                            housingNeeded={this.props.event.housingNeeded}
                            currentView={currentView}/>
              <button className="ui fluid bottom attached positive full width button"
                      onClick={this.editAttendee}>Join this event</button>
            </div>
          </div>
        </div>
    );
  }
});

module.exports = EventModal;
