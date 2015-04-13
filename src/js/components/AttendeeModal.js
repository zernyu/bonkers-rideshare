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
                <h2 className="ui header">{this.props.attendee.name || 'I wanna race!'}
                  <div className="sub header"></div>
                </h2>
              </div>
              <div className="ui bottom attached segment">
                <div className="ui two fluid buttons">
                  <div className="ui button" onClick={this.closeModal}>Cancel</div>
                  <div className="ui right labeled positive icon button" onClick={this.addAttendee}>Save
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
