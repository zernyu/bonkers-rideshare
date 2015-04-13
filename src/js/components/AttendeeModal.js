var AttendeeModal = React.createClass({
  mixins: [React.addons.LinkedStateMixin],

  closeModal: function () {
    React.unmountComponentAtNode(this.getDOMNode().parentNode);
  },

  driving: function (driving) {
    this.setState({ driving: driving });
  },

  componentWillMount: function () {
    this.setState(this.props.attendee);
  },

  render: function () {
    var drivingClasses = classNames('ui button', { active: this.state.driving });
    var ridingClasses = classNames('ui button', { active: !this.state.driving });

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
                <div className="ui two fluid buttons">
                  <div className={drivingClasses} onClick={this.driving.bind(this, true)}>Driving</div>
                  <div className={ridingClasses} onClick={this.driving.bind(this, false)}>Bumming</div>
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
