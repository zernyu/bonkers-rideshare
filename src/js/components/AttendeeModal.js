var AttendeeModal = React.createClass({
  mixins: [React.addons.LinkedStateMixin],

  closeModal: function () {
    React.unmountComponentAtNode(this.getDOMNode().parentNode);
  },

  driving: function (driving) {
    this.setState({ driving: driving });
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
                    <select value={this.state.capacity}>
                      <option value="">Number of people including yourself</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                      <option value="6">6</option>
                    </select>
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
