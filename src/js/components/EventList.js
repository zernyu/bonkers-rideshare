var EventList = React.createClass({
  render: function() {
    return (
      <ul className="event list">
        {[{id: 'asdflkajsdf', name: 'wut'}].map(function (event) {
          return <Event key={event.id} data={event} />;
        })}
      </ul>
    );
  }
});

React.render(
    <EventList />,
    document.getElementById('root')
);
