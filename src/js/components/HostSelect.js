var HostSelect = React.createClass({
  onChange: function() {
    this.props.valueLink.requestChange(this.getDOMNode().value);
  },

  render: function () {
    return (
        <select onChange={this.onChange} value={this.props.valueLink.value}>
          <option value="">I need a floor to sleep on!</option>
          {this.props.options.map(function (host) {
            return <option key={'host' + host.objectId} value={host.objectId}>{host.name}</option>;
          })}
        </select>
    );
  }
});
