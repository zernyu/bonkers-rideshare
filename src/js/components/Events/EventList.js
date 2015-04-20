var React = require('react/addons');
var Parse = require('parse').Parse;
var ParseReact = require('parse-react');
var Event = require('./Event');

var EventList = React.createClass({
  mixins: [ParseReact.Mixin],

  observe: function () {
    return {
      events: (new Parse.Query('Event')).descending('date')
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

module.exports = EventList;