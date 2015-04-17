var React = require('react/addons');
var moment = require('moment');
var classNames = require('classnames');
var DayPicker = require('react-day-picker');

function valueToDate(s) {
  var date = moment(s, "YYYY-MM-DD", true);
  return date.isValid() ? date : null;
}

function dateToValue(d) {
  return d.format("YYYY-MM-DD");
}

function isSameDay(a, b) {
  return a.startOf('day').isSame(b.startOf('day'));
}

var AddEventModal = React.createClass({
  mixins: [React.addons.LinkedStateMixin],

  closeModal: function () {
    React.unmountComponentAtNode(this.getDOMNode().parentNode);
  },

  handleDateChange: function (date) {
    this.setState({
      date: date
    });
  },

  handleInputFocus(e) {
    this.showMonthForCurrentValue();
  },

  handleInputChange(e) {
    const value = e.target.value;
    this.setState({
      value: value
    }, this.showMonthForCurrentValue);
  },

  handleDayTouchTap(day, modifiers, e) {
    if (modifiers.indexOf('disabled') === -1) {
      this.setState({
        value: dateToValue(day)
      });
    }
  },

  showMonthForCurrentValue() {
    const day = valueToDate(this.state.value);

    if (!day) {
      return;
    }

    // if the current state is a valid day, show its month on the calendar
    this.refs.daypicker.showMonth(day.startOf('month'));
  },

  getModifiers() {
    var modifiers = {
      today: function(day) {
        return isSameDay(moment(), day);
      },
      disabled: function(day) {
        // disable past days
        return day.diff(moment(), 'day') < 0;
      },
      selected: function(day) {
        const value = valueToDate(this.state.value);

        if (modifiers.disabled(day) || !value) {
          // value may be null if not a valid date
          return false;
        }
        else {
          return isSameDay(value, day);
        }
      }.bind(this)
    };
    return modifiers;
  },

  getInitialState: function () {
    return {
      date: moment(),
      value: dateToValue(moment()),
      validation: {}
    };
  },

  render: function () {
    var nameValidation = classNames('ui pointing red label', {'hidden': !this.state.validation.name});
    var value = this.state.value;

    return (
        <div className="ui scrollable page dimmer transition visible animating fade in">
          <div className="ui small basic modal attendee content">
            <div className="ui basic segment">
              <div className="ui top attached segment">
                <h2 className="ui header">{this.state.name || 'Let\'s race!'}</h2>
              </div>
              <div className="ui attached form segment">
                <div className="field">
                  <label>Name</label>
                  <input type="text"
                         placeholder="Getz Farm Classic"
                         ref="name"
                         validate={true}
                         valueLink={this.linkState('name')}/>

                  <div className={nameValidation}>{this.state.validation.name}</div>
                </div>
                <div className="field">
                  <label>Date</label>
                  <input
                    type="text"
                    value={value}
                    placeholder="YYYY-MM-DD"
                    onChange={this.handleInputChange}
                    onFocus={this.handleInputFocus} />
                </div>
              </div>
              <div className="ui bottom attached segment">
                <div className="ui two fluid buttons">
                  <button className="ui button" onClick={this.closeModal}>Cancel</button>
                  <button className="ui right labeled positive icon button" onClick={this.addAttendee}>
                    Add event
                    <i className="right chevron icon"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <DayPicker
              ref="daypicker"
              enableOutsideDays={true}
              initialMonth={ valueToDate(value) || moment() }
              numberOfMonths={1}
              modifiers={ this.getModifiers() }
              onDayTouchTap={this.handleDayTouchTap} />
        </div>
    );
  }
});

module.exports = AddEventModal;