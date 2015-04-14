var HostSelect = React.createClass({
  mixins: [ParseReact.Mixin],

  observe: function () {
    return {
      hosts: (new Parse.Query('Attendee'))
          .equalTo('eventId', this.props.eventId)
          .equalTo('hosting', true)
          .ascending('name')
    };
  },

  onChange: function() {
    this.props.valueLink.requestChange(this.getDOMNode().value);
  },

  render: function () {
    return (
        <select onChange={this.onChange} value={this.props.valueLink.value}>
          <option value="">I need a floor to sleep on!</option>
          {this.data.hosts.map(function (host) {
            return <option key={'host' + host.objectId} value={host.objectId}>{host.name}</option>;
          })}
        </select>
    );
  }
});
