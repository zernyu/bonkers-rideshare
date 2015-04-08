var EventList = React.createClass({
  render: function() {
    return (
      <div className="ui large event link list">
        {[{id: 'asdflkajsdf', name: 'Hillsboro Roubaix', date: 'Wed Apr 8'}].map(function (event) {
          return <Event key={event.id} data={event} />;
        })}
      </div>
    );
  }
});

React.render(
    <EventList />,
    document.getElementById('eventsRoot')
);