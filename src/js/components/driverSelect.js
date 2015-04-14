var DriverSelect = React.createClass({
  mixins: [ParseReact.Mixin],

  observe: function () {
    return {
      drivers: (new Parse.Query('Attendee'))
          .equalTo('eventId', this.props.eventId)
          .equalTo('driving', true)
          .ascending('name')
    };
  },

  onChange: function() {
    this.props.valueLink.requestChange(this.getDOMNode().value);
  },

  render: function () {
    return (
        <select onChange={this.onChange} value={this.props.valueLink.value}>
          <option value="">I need a ride!</option>
          {this.data.drivers.map(function (driver) {
            return <option key={'driver' + driver.objectId} value={driver.objectId}>{driver.name}</option>;
          })}
        </select>
    );
  }
});
