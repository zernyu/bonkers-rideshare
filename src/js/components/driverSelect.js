var DriverSelect = React.createClass({
  onChange: function() {
    this.props.valueLink.requestChange(this.getDOMNode().value);
  },

  render: function () {
    return (
        <select onChange={this.onChange} value={this.props.valueLink.value}>
          <option value="">I need a ride!</option>
          {this.props.options.map(function (driver) {
            return <option key={'driver' + driver.objectId} value={driver.objectId}>{driver.name}</option>;
          })}
        </select>
    );
  }
});

module.exports = DriverSelect;