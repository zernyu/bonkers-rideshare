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
    document.getElementsByTagName('html')[0].classList.remove('noscroll');
    document.body.classList.remove('noscroll');
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
      currentView: 'transportation'
    };
  },

  componentWillMount: function () {
    document.getElementsByTagName('html')[0].classList.add('noscroll');
    document.body.classList.add('noscroll');
  },

  render: function () {
    var currentView = this.state.currentView;
    var housingNeeded = this.props.event.housingNeeded;

    var toggleButtonClasses = classNames('ui fluid attached full width buttons', {one: !housingNeeded, two: housingNeeded});
    var racingToggleClasses = classNames('ui button', {'blue active': currentView === 'racing'});
    var transportationToggleClasses = classNames('ui button', {'blue active': currentView === 'transportation'});
    var housingToggleClasses = classNames('ui button', {'blue active': currentView === 'housing', hidden: !housingNeeded});

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
                <div className={transportationToggleClasses}
                     onClick={this.toggleView.bind(this, 'transportation')}>Transport</div>
                <div className={housingToggleClasses}
                     onClick={this.toggleView.bind(this, 'housing')}>Housing</div>
              </div>
              <AttendeeList eventId={this.props.event.objectId}
                            housingNeeded={this.props.event.housingNeeded}
                            currentView={currentView}/>
              <button className="ui fluid bottom attached blue huge full width button"
                      onClick={this.editAttendee}>Join this event</button>
            </div>
          </div>
        </div>
    );
  }
});

module.exports = EventModal;
