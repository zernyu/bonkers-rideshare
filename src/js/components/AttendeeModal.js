var AttendeeModal = React.createClass({
  closeModal: function () {
    React.unmountComponentAtNode(this.getDOMNode().parentNode);
  },

  render: function () {
    return (
        <div className="ui scrollable page dimmer transition visible animating fade in">
          <div className="ui small basic modal event attendee content">
            <div className="ui basic segment">
              <div className="ui top attached segment">
                <h2 className="ui header">{this.props.attendee.name || 'Add attendee'}
                  <div className="sub header"></div>
                </h2>
              </div>
              <div className="ui fluid attached green join button" onClick={this.addAttendee}>Save</div>
              <div className="ui bottom attached segment"></div>
            </div>
          </div>
        </div>
    );
  }
});
