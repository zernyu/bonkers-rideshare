var Event = React.createClass({
  openEvent: function () {
    var eventModal = React.createElement(EventModal, {event: this.props.data});
    React.render(eventModal, document.getElementById('eventModal'));
  },

  render: function () {
    return (
        <a className="event item" onClick={this.openEvent}>
          <div className="header">{this.props.data.name}</div>
          <span className="subtitle">{this.props.data.date.toDateString()}</span>
        </a>
    );
  }
});
