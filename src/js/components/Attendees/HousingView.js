var React = require('react/addons');

var HousingView = React.createClass({
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
            <th>Hosting</th>
            <th>Staying with</th>
            <th className="six wide">Notes</th>
          </tr>
          </thead>
          <tbody>
          {this.props.attendees.map(function (attendee) {
            var capacity;
            var bumming;

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
            <th>{hosting} spots available</th>
            <th>{needsHost}/{totalAttendees} need a roof</th>
            <th></th>
          </tr>
          </tfoot>
        </table>
    );
  }
});

module.exports = HousingView;
