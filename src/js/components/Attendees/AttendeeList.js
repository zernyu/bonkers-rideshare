var _ = require('underscore');
var React = require('react/addons');
var Parse = require('parse').Parse;
var ParseReact = require('parse-react');
var AddAttendeeModal = require('../Attendees/AddAttendeeModal');
var RacingView = require('./RacingView');
var TransportationView = require('./TransportationView');
var HousingView = require('./HousingView');

var AttendeeList = React.createClass({
  mixins: [ParseReact.Mixin],

  observe: function () {
    return {
      attendees: (new Parse.Query('Attendee'))
          .equalTo('eventId', this.props.eventId)
          .include('ridingWith')
          .include('roomingWith')
          .ascending('name')
    };
  },

  editAttendee: function (attendee) {
    React.render(
        <AddAttendeeModal eventId={this.props.eventId}
                          attendee={_.clone(attendee) || {}}
                          housingNeeded={this.props.housingNeeded}/>,
        document.getElementById('attendeeModal')
    );
  },


  render: function () {
    switch (this.props.currentView) {
      case 'racing':
        return <RacingView attendees={this.data.attendees} editAttendee={this.editAttendee}/>;
      case 'transportation':
        return <TransportationView attendees={this.data.attendees} editAttendee={this.editAttendee}/>;
      case 'housing':
        return <HousingView attendees={this.data.attendees} editAttendee={this.editAttendee}/>;
    }
  }
});

module.exports = AttendeeList;