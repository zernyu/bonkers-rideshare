var React = require('react/addons');

var TransportationView = React.createClass({
  editAttendee: function (attendee) {
    this.props.editAttendee(attendee);
  },

  render: function () {
    var hosting = 0;
    var needsHost = 0;
    var totalAttendees = this.props.attendees.length;

    return (
        <table className="ui attached unstackable table">
          <thead>
          <tr>
            <th>Name</th>
            <th>Driving</th>
            <th>Riding with</th>
            <th className="six wide">Notes</th>
          </tr>
          </thead>
          <tbody>
          {this.props.attendees.map(function (attendee) {
            var capacity;
            var bumming;

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

            return (
                <tr key={attendee.objectId} onClick={this.editAttendee.bind(this, attendee)}>
                  <td>{attendee.name}</td>
                  <td>{capacity}</td>
                  <td>{bumming}</td>
                  <td>{attendee.notes}</td>
                </tr>
            );
          }, this)}
          </tbody>
          <tfoot>
          <tr>
            <th>{totalAttendees} attendees</th>
            <th>{hosting} seats available</th>
            <th>{needsHost}/{totalAttendees} need a ride</th>
            <th></th>
          </tr>
          </tfoot>
        </table>
    );
  }
});

module.exports = TransportationView;
