var React = require('react/addons');
var AddEventModal = require('./AddEventModal');
var EventList = require('./EventList');

var Events = React.createClass({
  addEvent: function () {
    React.render(<AddEventModal event={{}} />, document.getElementById('eventModal'));
  },

  render: function () {
    return (
        <div>
          <div className="ui page grid">
            <div className="row">
              <div className="center aligned column">
                <h1 className="ui basic segment centered header">
                  Catch a ride!
                  <div className="sub header">with some pretty sweet people</div>
                </h1>
              </div>
            </div>

            <div className="row">
              <div className="column">
                <h2 className="ui left floated header">
                  <i className="checkered flag icon"></i>

                  <div className="content">Events</div>
                </h2>
                <button className="ui right floated positive labeled icon button" onClick={this.addEvent}>
                  Add Event
                  <i className="plus icon"></i>
                </button>
                <div className="ui hidden clearing divider"></div>

                <EventList className="ui basic segment"/>
              </div>
            </div>
          </div>

          <div id="eventModal"></div>
          <div id="attendeeModal"></div>
        </div>
    );
  }
});

module.exports = Events;