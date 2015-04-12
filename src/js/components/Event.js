var Event = React.createClass({
  render: function() {
    return (
      <a className="event item">
        <div className="header">{this.props.data.name}</div>
        <span className="subtitle">{this.props.data.date.toDateString()}</span>
      </a>
    );
  }
});
