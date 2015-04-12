var EventList = React.createClass({
  mixins: [ParseReact.Mixin],

  observe: function () {
    return {
      events: (new Parse.Query('Event')).descending('createdAt')
    };
  },

  render: function () {
    return (
        <div className="ui large event selection list">
          {this.data.events.map(function (event) {
            return <Event key={event.objectId} data={event}/>;
          })}
        </div>
    );
  }
});

React.render(
    <EventList />,
    document.getElementById('eventsRoot')
);