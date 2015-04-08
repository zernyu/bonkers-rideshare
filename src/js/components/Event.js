var Event = React.createClass({
  render: function() {
    return (
      <li className="event item">
        {this.props.data.name}
      </li>
    );
  }
});
