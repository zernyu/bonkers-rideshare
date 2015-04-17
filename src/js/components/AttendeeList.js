var React = require('react/addons');
var Parse = require('parse').Parse;
var ParseReact = require('parse-react');

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
    this.props.editAttendee(attendee);
  },

  render: function () {
    var hosting = 0;
    var needsHost = 0;
    var totalAttendees = this.data.attendees.length;
    var transportationView = this.props.transportationView;

    return (
        <table className="ui attached unstackable table">
          <thead>
          <tr>
            <th>Name</th>
            <th>{transportationView ? 'Driving' : 'Hosting'}</th>
            <th>{transportationView ? 'Riding with' : 'Staying with'}</th>
            <th className="six wide">Notes</th>
          </tr>
          </thead>
          <tbody>
          {this.pendingQueries().length === 0
              ? this.data.attendees.map(function (attendee) {
                var capacity;
                var bumming;
                if (this.props.transportationView) {
                  if (attendee.driving) {
                    capacity = attendee.carCapacity + ' bikes';
                    bumming = '';
                    hosting += parseInt(attendee.carCapacity);
                  } else {
                    capacity = '';
                    if (attendee.ridingWith) {
                      bumming = attendee.ridingWith.name;
                    } else {
                      bumming = 'needs a ride';
                      needsHost++;
                    }
                  }
                } else {
                  if (attendee.hosting) {
                    capacity = attendee.hostingCapacity + ' sleeping spots';
                    bumming = '';
                    hosting += parseInt(attendee.hostingCapacity);
                  } else {
                    capacity = '';
                    if (attendee.roomingWith) {
                      bumming = attendee.roomingWith.name;
                    } else {
                      bumming = 'needs a roof';
                      needsHost++;
                    }
                  }
                }

                return (
                    <tr key={attendee.objectId} onClick={this.editAttendee.bind(this, attendee)}>
                      <td>{attendee.name}</td>
                      <td>{capacity}</td>
                      <td>{bumming}</td>
                      <td>{attendee.notes}</td>
                    </tr>
                );
              }, this)
              : <tr>
            <td>Loading...</td>
          </tr>}
          </tbody>
          <tfoot>
          <tr>
            <th>{totalAttendees} attendees</th>
            <th>{hosting} {transportationView ? 'seats' : 'spots'} available</th>
            <th>{needsHost}/{totalAttendees} need a {transportationView ? 'ride' : 'roof'}</th>
            <th></th>
          </tr>
          </tfoot>
        </table>
    );
  }
});

module.exports = AttendeeList;