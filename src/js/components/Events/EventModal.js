var _ = require('underscore');
var moment = require('moment');
var React = require('react/addons');
var classNames = require('classnames');
var AttendeeList = require('../Attendees/AttendeeList');
var AddAttendeeModal = require('../Attendees/AddAttendeeModal');

var EventModal = React.createClass({
  closeModal: function () {
    React.unmountComponentAtNode(this.getDOMNode().parentNode);
  },

  toggleView: function (switchTo) {
    this.setState({
      transportationView: switchTo === 'transportation'
    });
  },

  editAttendee: function (attendee) {
    React.render(
        <AddAttendeeModal eventId={this.props.event.objectId} attendee={_.clone(attendee) || {}}/>,
        document.getElementById('attendeeModal')
    );
  },

  getInitialState: function () {
    return {
      transportationView: true
    };
  },

  render: function () {
    var transportationView = this.state.transportationView;

    var transportationToggle = classNames('ui button', {'positive active': transportationView});
    var housingToggle = classNames('ui button', {'positive active': !transportationView});

    var registerLink = '';
    if (this.props.event.registrationUrl) {
      registerLink = <a className="registration"
                        href={this.props.event.registrationUrl}
                        target="_blank">Event registration <i className="small external icon"></i></a>;
    }

    return (
        <div className="ui scrollable page dimmer transition visible animating fade in">
          <div className="event content">
            <div className="ui basic segment">
              <div className="ui top attached segment">
                <h2 className="ui header">{this.props.event.name}
                  <div className="sub header">{moment(this.props.event.date).format('dddd, MMMM Do YYYY')}</div>
                </h2>
                {registerLink}
                <i className="remove circle icon" onClick={this.closeModal}></i>
              </div>
              <div className="ui two fluid attached full width buttons">
                <div className={transportationToggle}
                     onClick={this.toggleView.bind(this, 'transportation')}>Transportation
                </div>
                <div className={housingToggle} onClick={this.toggleView.bind(this, 'housing')}>Housing</div>
              </div>
              <AttendeeList editAttendee={this.editAttendee}
                            eventId={this.props.event.objectId}
                            transportationView={transportationView}/>
              <button className="ui fluid bottom attached positive full width button"
                      onClick={this.editAttendee}>Join this event</button>
            </div>
          </div>
        </div>
    );
  }
});

module.exports = EventModal;
