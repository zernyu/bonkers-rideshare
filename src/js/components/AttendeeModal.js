var AttendeeModal = React.createClass({
  mixins: [React.addons.LinkedStateMixin],

  closeModal: function () {
    React.unmountComponentAtNode(this.getDOMNode().parentNode);
  },

  driving: function (driving) {
    this.setState({ driving: driving });
  },

  hosting: function (hosting) {
    this.setState({ hosting: hosting });
  },

  componentWillMount: function () {
    var defaultState = this.props.attendee;
    this.setState(defaultState);
  },

  render: function () {
    var drivingToggle = classNames('ui button', { 'positive active': this.state.driving });
    var ridingToggle = classNames('ui button', { 'positive active': !this.state.driving });
    var drivingForm = classNames('field group', { 'hidden': !this.state.driving });
    var ridingForm = classNames('field group', { 'hidden': this.state.driving });

    var hostingToggle = classNames('ui button', { 'positive active': this.state.hosting });
    var roomingToggle = classNames('ui button', { 'positive active': !this.state.hosting });
    var hostingForm = classNames('field group', { 'hidden': !this.state.hosting });
    var roomingForm = classNames('field group', { 'hidden': this.state.hosting });

    return (
        <div className="ui scrollable page dimmer transition visible animating fade in">
          <div className="ui small basic modal event attendee content">
            <div className="ui basic segment">
              <div className="ui top attached segment">
                <h2 className="ui header">{this.state.name || 'I wanna race!'}
                  <div className="sub header">{this.state.name ? 'wants to race!' : ''}</div>
                </h2>
              </div>
              <div className="ui attached form segment">
                <div className="field">
                  <label>Name</label>
                  <input type="text" valueLink={this.linkState('name')} />
                </div>
                <div className="field">
                  <div className="ui two fluid buttons">
                    <div className={drivingToggle} onClick={this.driving.bind(this, true)}>
                      <i className="car icon"></i> Driving</div>
                    <div className={ridingToggle} onClick={this.driving.bind(this, false)}>
                      <i className="handicap icon"></i> Bumming</div>
                  </div>
                </div>
                <div className={drivingForm}>
                  <div className="field">
                    <label>Car capacity</label>
                    <input type="text"
                           placeholder="Number of riders (including yourself)"
                           value={this.state.carCapacity} />
                  </div>
                </div>
                <div className={ridingForm}>
                  <div className="field">
                    <label>Riding with</label>
                    <select value={this.state.ridingWith}>
                      <option value="">Need a ride!</option>
                    </select>
                  </div>
                </div>
                <div className="field">
                  <div className="ui two fluid buttons">
                    <div className={hostingToggle} onClick={this.hosting.bind(this, true)}>
                      <i className="car icon"></i> Hosting</div>
                    <div className={roomingToggle} onClick={this.hosting.bind(this, false)}>
                      <i className="handicap icon"></i> Bumming</div>
                  </div>
                </div>
                <div className={hostingForm}>
                  <div className="field">
                    <label>Housing capacity</label>
                    <input type="text"
                           placeholder="Number of people (including yourself) who can stay with you"
                           value={this.state.hostingCapacity} />
                  </div>
                </div>
                <div className={roomingForm}>
                  <div className="field">
                    <label>Rooming with</label>
                    <select value={this.state.roomingWith}>
                      <option value="">Need a floor to sleep on!</option>
                    </select>
                  </div>
                </div>
                <div className="field">
                  <label>Notes</label>
                  <textarea placeholder="Leaving from Star Lounge at 8am, bringing a teddy bear" value={this.state.notes}></textarea>
                </div>
              </div>
              <div className="ui bottom attached segment">
                <div className="ui two fluid buttons">
                  <div className="ui button" onClick={this.closeModal}>Cancel</div>
                  <div className="ui right labeled positive icon button" onClick={this.addAttendee}>Join
                    <i className="right chevron icon"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    );
  }
});
