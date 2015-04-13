var EventModal = React.createClass({
  mixins: [ParseReact.Mixin],

  observe: function () {
    return {
      attendees: (new Parse.Query('Attendee')).equalTo('eventId', this.props.event.objectId).descending('createdAt')
    };
  },

  addAttendee: function () {
    var attendeeModal = React.createElement(AttendeeModal, {event: this.props.event, attendee: {}});
    React.render(attendeeModal, document.getElementById('attendeeModal'));
  },

  closeModal: function () {
    React.unmountComponentAtNode(this.getDOMNode().parentNode);
  },

  render: function () {
    return (
        <div className="ui scrollable page dimmer transition visible animating fade in">
          <div className="event content">
            <div className="ui basic segment">
              <div className="ui top attached segment">
                <h2 className="ui header">{this.props.event.name}
                  <div className="sub header">{this.props.event.date.toDateString()}</div>
                </h2>
                <i className="remove circle icon" onClick={this.closeModal}></i>
              </div>
              <div className="ui fluid attached positive join button" onClick={this.addAttendee}>Join this event</div>
              <table className="ui attached table">
                <thead>
                <tr>
                  <th>Name</th>
                  <th>Driving</th>
                  <th>Riding with</th>
                  <th>Notes</th>
                </tr>
                </thead>
                <tbody>
                {this.data.attendees.map(function (attendee) {
                  return (
                    <tr key={attendee.objectId}>
                      <td>{attendee.name}</td>
                      <td>{attendee.carCapacity}</td>
                      <td>{attendee.ridingWith}</td>
                      <td>{attendee.notes}</td>
                    </tr>
                  );
                })}
                </tbody>
                <tfoot>
                <tr>
                  <th>{this.data.attendees.length} attendees</th>
                  <th>2 drivers</th>
                  <th>6 need a ride</th>
                  <th></th>
                </tr>
                </tfoot>
              </table>
              <div className="ui fluid attached positive join button" onClick={this.addAttendee}>Join this event</div>
              <div className="ui bottom attached segment"></div>
            </div>
          </div>
          <div id="attendeeModal"></div>
        </div>
    );
  }
});
