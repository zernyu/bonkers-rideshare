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

  toggleView: function (switchTo) {
    this.setState({
      transportationView: switchTo === 'transportation'
    });
  },

  getInitialState: function () {
    return {
      transportationView: true
    };
  },

  render: function () {
    var transportationView = this.state.transportationView;

    var transportationToggle = classNames('ui button', { 'positive active': transportationView });
    var housingToggle = classNames('ui button', { 'positive active': !transportationView });

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
              <div className="ui two fluid attached full width buttons">
                <div className={transportationToggle} onClick={this.toggleView.bind(this, 'transportation')}>Transportation</div>
                <div className={housingToggle} onClick={this.toggleView.bind(this, 'housing')}>Housing</div>
              </div>
              <table className="ui attached unstackable table">
                <thead>
                <tr>
                  <th>Name</th>
                  <th>{transportationView ? 'Driving' : 'Hosting'}</th>
                  <th>{transportationView ? 'Riding with' : 'Staying with'}</th>
                  <th>Notes</th>
                </tr>
                </thead>
                <tbody>
                {this.data.attendees.map(function (attendee) {
                  return (
                    <tr key={attendee.objectId}>
                      <td>{attendee.name}</td>
                      <td>{transportationView ? attendee.carCapacity : attendee.houseCapacity}</td>
                      <td>{transportationView ? attendee.ridingWith : attendee.stayingWith}</td>
                      <td>{attendee.notes}</td>
                    </tr>
                  );
                })}
                </tbody>
                <tfoot>
                <tr>
                  <th>{this.data.attendees.length} attendees</th>
                  <th>2 are {transportationView ? 'driving' : 'hosting'}</th>
                  <th>6 need a {transportationView ? 'ride' : 'roof'}</th>
                  <th></th>
                </tr>
                </tfoot>
              </table>
              <div className="ui fluid bottom attached positive full width button" onClick={this.addAttendee}>Join this event</div>
            </div>
          </div>
          <div id="attendeeModal"></div>
        </div>
    );
  }
});
