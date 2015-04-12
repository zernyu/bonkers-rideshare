var EventModal = React.createClass({
  render: function () {
    return (
        <div className="ui scrollable page dimmer transition visible animating fade in">
          <div className="event content">
            <div className="center">
              <div className="ui attached segment">
                <h2 className="ui header">{this.props.data.name}
                  <div className="sub header">{this.props.data.date.toDateString()}</div>
                </h2>
                <i className="remove circle icon"></i>
              </div>
              <div className="ui fluid attached blue button">Join this event</div>
              <table className="ui attached table">
                <thead>
                <tr>
                  <th>Name</th>
                  <th>Driving</th>
                  <th>Riding with</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                  <td>John</td>
                  <td>Approved</td>
                  <td>None</td>
                </tr>
                <tr>
                  <td>Jamie</td>
                  <td>Approved</td>
                  <td>Requires call</td>
                </tr>
                <tr>
                  <td>Jill</td>
                  <td>Denied</td>
                  <td>None</td>
                </tr>
                </tbody>
                <tfoot>
                <tr>
                  <th>3 People</th>
                  <th>2 Drivers</th>
                  <th>6 Need a ride</th>
                </tr>
                </tfoot>
              </table>
              <div className="ui fluid attached blue button">Join this event</div>
            </div>
          </div>
        </div>
    );
  }
});
