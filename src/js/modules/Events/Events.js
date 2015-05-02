var React = require('react/addons');
var AddEventModal = require('./AddEventModal');
var EventList = require('./EventList');
var classNames = require('classnames');

var Events = React.createClass({
  addEvent: function () {
    React.render(<AddEventModal event={{}}/>, document.getElementById('eventModal'));
  },

  toggleEditMode: function () {
    this.setState({editEnabled: !this.state.editEnabled});
  },

  getInitialState: function () {
    return {
      editEnabled: false
    };
  },

  render: function () {
    var editButtonClasses = classNames('ui right floated icon button', {blue: this.state.editEnabled});

    return (
        <div>
          <div className="ui page grid">
            <div className="row">
              <div className="center aligned column">
                <h1 className="ui basic segment centered header">
                  Catch a ride!
                  <div className="sub header">with some pretty sweet folks</div>
                </h1>
              </div>
            </div>

            <div className="row">
              <div className="column">
                <button className={editButtonClasses} onClick={this.toggleEditMode}>
                  <i className="setting icon"></i>
                </button>
                <button className="ui right floated positive labeled icon button" onClick={this.addEvent}>
                  Add Event
                  <i className="plus icon"></i>
                </button>
              </div>
            </div>

            <div className="row">
              <div className="column">
                <EventList editEnabled={this.state.editEnabled}/>
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