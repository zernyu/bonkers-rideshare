var EventModal = React.createClass({
  mixins: [ParseReact.Mixin],

  observe: function () {
    return {
      attendees: (new Parse.Query('Attendee'))
          .equalTo('eventId', this.props.event.objectId)
          .include('ridingWith')
          .include('roomingWith')
          .descending('createdAt')
    };
  },

  editAttendee: function (attendee) {
    var attendeeModal = React.createElement(AttendeeModal, {event: this.props.event, attendee: _.clone(attendee) || {}});
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

    var hosting = 0;
    var needsHost = 0;
    var totalAttendees = this.data.attendees.length;

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
                {this.pendingQueries().length === 0 ? this.data.attendees.map(function (attendee) {
                  var capacity;
                  var bumming;
                  if (transportationView) {
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
                }, this) : <tr><td>Loading...</td></tr>}
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
              <div className="ui fluid bottom attached positive full width button" onClick={this.editAttendee}>Join this event</div>
            </div>
          </div>
          <div id="attendeeModal"></div>
        </div>
    );
  }
});
