var Event = React.createClass({
  render: function() {
    return (
      <div className="event item">
        <a className="header">{this.props.data.name}</a>
        <span className="subtitle">{this.props.data.date}</span>
      </div>
    );
  }
});
