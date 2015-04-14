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

  addAttendee: function () {
    var passed = _.every(this.refs, function (validationField, validationKey) {
      return this.validateField(validationField, validationKey);
    }, this);
  },

  validateField: function (field, validationKey) {
    var validationError = undefined;

    if (field.props.validate) {
      var value = field.getDOMNode().value;
      if (value !== '') {
        validationError = 'Enter a number, doofus!';
      } else if (isNaN(parseInt(value))) {
        validationError = 'Enter a real number, doofus!';
      }
    }

    // Reset validation error if validation passes and validation error is being displayed
    if (validationError === undefined && this.state.validation[validationKey]) {
      validationError = false;
    }

    if (validationError !== undefined) {
      var validationState = this.state.validation;
      validationState[validationKey] = validationError;
      this.setState({ validation: validationState });
    }

    return !validationError;
  },

  componentWillMount: function () {
    var defaultState = this.props.attendee;
    defaultState.validation = {};
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

    var carCapacityValidation = classNames('ui pointing red label', { 'hidden': !this.state.validation.carCapacity });
    var hostingCapacityValidation = classNames('ui pointing red label', { 'hidden': !this.state.validation.hostingCapacity });

    return (
        <div className="ui scrollable page dimmer transition visible animating fade in">
          <div className="ui small basic modal attendee content">
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
                    <input type="tel"
                           placeholder="Number of riders (including yourself)"
                           ref="carCapacity"
                           validate={this.state.driving}
                           value={this.state.carCapacity} />
                    <div className={carCapacityValidation}>{this.state.validation.carCapacity}</div>
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
                      <i className="home icon"></i> Hosting</div>
                    <div className={roomingToggle} onClick={this.hosting.bind(this, false)}>
                      <i className="trash icon"></i> Bumming</div>
                  </div>
                </div>
                <div className={hostingForm}>
                  <div className="field">
                    <label>Housing capacity</label>
                    <input type="tel"
                           placeholder="Number of people (including yourself) who can stay with you"
                           ref="hostingCapacity"
                           validate={this.state.hosting}
                           value={this.state.hostingCapacity} />
                    <div className={hostingCapacityValidation}>{this.state.validation.hostingCapacity}</div>
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
