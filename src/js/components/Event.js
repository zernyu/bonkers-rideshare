var Event = React.createClass({
  openEvent: function () {
    var eventModal = React.createElement(EventModal, {data: this.props.data});
    React.render(eventModal, document.body);
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
