var EventModal = React.createClass({
  mixins: [ParseReact.Mixin],

  observe: function () {
    return {
      attendees: (new Parse.Query('Attendee')).equalTo('eventId', this.props.event.objectId).descending('createdAt')
    };
  },

  closeModal: function () {
    React.unmountComponentAtNode(this.getDOMNode().parentNode);
  },

  render: function () {
    return (
        <div className="ui scrollable page dimmer transition visible animating fade in">
          <div className="event content">
            <div className="center">
              <div className="ui attached segment">
                <h2 className="ui header">{this.props.event.name}
                  <div className="sub header">{this.props.event.date.toDateString()}</div>
                </h2>
                <i className="remove circle icon" onClick={this.closeModal}></i>
              </div>
              <div className="ui fluid attached blue button">Join this event</div>
              <table className="ui attached table">
                <thead>
                <tr>
                  <th>Name</th>
                  <th>Driving</th>
                  <th>Riding with</th>
                </tr>
                </thead>
                <tbody>
                {this.data.attendees.map(function (attendee) {
                  return (
                    <tr key={attendee.objectId}>
                      <td>{attendee.name}</td>
                      <td>Approved</td>
                      <td>None</td>
                    </tr>
                  );
                })}
                <tr>
                  <td>John</td>
                  <td>Approved</td>
                  <td>None</td>
                </tr>
                <tr>
                  <td>Jamie</td>
                  <td>Approved</td>
                  <td>Requires call</td>
                </tr>
                <tr>
                  <td>Jill</td>
                  <td>Denied</td>
                  <td>None</td>
                </tr>
                </tbody>
                <tfoot>
                <tr>
                  <th>3 People</th>
                  <th>2 Drivers</th>
                  <th>6 Need a ride</th>
                </tr>
                </tfoot>
              </table>
              <div className="ui fluid attached blue button">Join this event</div>
            </div>
          </div>
        </div>
    );
  }
});
