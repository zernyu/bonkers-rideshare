var React = require('react/addons');

var RacingView = React.createClass({
  editAttendee: function (attendee) {
    this.props.editAttendee(attendee);
  },

  render: function () {
    var totalAttendees = this.props.attendees.length;

    return (
        <table className="ui attached unstackable table">
          <thead>
          <tr>
            <th>Name</th>
            <th>Races</th>
            <th className="six wide">Notes</th>
          </tr>
          </thead>
          <tbody>
          {this.props.attendees.map(function (attendee) {
            return (
                <tr key={attendee.objectId} onClick={this.editAttendee.bind(this, attendee)}>
                  <td>{attendee.name}</td>
                  <td>{attendee.races}</td>
                  <td>{attendee.notes}</td>
                </tr>
            );
          }, this)}
          </tbody>
          <tfoot>
          <tr>
            <th>{totalAttendees} attendees</th>
            <th></th>
            <th></th>
          </tr>
          </tfoot>
        </table>
    );
  }
});

module.exports = RacingView;
