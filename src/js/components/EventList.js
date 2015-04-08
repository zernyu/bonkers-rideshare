var EventList = React.createClass({
  render: function() {
    return (
      <div className="event list">
        Hello, world! I am an EventList!
      </div>
    );
  }
});
React.render(
  <EventList />,
  document.getElementById('content')
);