var React = require('react/addons');
var Parse = require('parse').Parse;
var ParseReact = require('parse-react');
var EventListItem = require('./EventListItem');
var classNames = require('classnames');

var EventList = React.createClass({
  mixins: [ParseReact.Mixin],

  observe: function () {
    return {
      events: (new Parse.Query('Event')).descending('date')
    };
  },

  render: function () {
    var editEnabled = this.props.editEnabled;

    return (
        <div className={classNames('ui large event selection list', {edit: editEnabled})}>
          {this.data.events.map(function (event) {
            return <EventListItem key={event.objectId} event={event} editEnabled={editEnabled}/>;
          })}
        </div>
    );
  }
});

module.exports = EventList;