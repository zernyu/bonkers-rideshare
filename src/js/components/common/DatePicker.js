var React = require('react/addons');
var DayPicker = require('react-day-picker');
var moment = require('moment');

/**
 * A wrapper for react-day-picker with date-range functionality and default styling.
 */
var DatePicker = React.createClass({
  selectDay: function (day, options) {
    if (options.indexOf('disabled') !== -1) {
      return;
    }

    // If the user clicks on a day from another month, switch the calendar to that month
    if (!day.isSame(this.refs.daypicker.state.month, 'month')) {
      this.refs.daypicker.showMonth(day);
    }

    var newState;

    if (this.props.selectRange) {
      if (this.state.selectingEndDate && day.isBefore(moment(this.state.date), 'day')) {
        // If the user chose an end date before the start date, just reverse the dates
        newState = {
          date: day.toDate(),
          endDate: this.state.date,
          selectingEndDate: false
        };
      } else if (this.state.selectingEndDate && day.isAfter(moment(this.state.date), 'day')) {
        newState = {
          date: this.state.date,
          endDate: day.toDate(),
          selectingEndDate: false
        };
      } else {
        // If the user chooses the same end date, just remove the end date
        newState = {
          date: day.toDate(),
          endDate: null,
          selectingEndDate: true
        };
      }
    } else {
      newState = {
        date: day.toDate()
      };
    }

    this.props.onDatePicked(newState.date, newState.endDate);
    this.setState(newState);
  },

  calendarOptions: function () {
    var options = {
      today: function (day) {
        return day.isSame(moment(), 'day');
      },

      // disable past days
      disabled: function (day) {
        return day.isBefore(moment(), 'day');
      },

      selected: function (day) {
        var currentDate = moment(this.state.date);

        if (options.disabled(day) || !currentDate) {
          // date may be null if not a valid date
          return false;
        }
        else if (!this.state.endDate) {
          return day.isSame(currentDate, 'day');
        } else {
          return day.isBetween(currentDate.subtract(1, 'day'), moment(this.state.endDate).add(1, 'day'), 'day');
        }
      }.bind(this)
    };
    return options;
  },

  getInitialState: function () {
    return {
      selectingEndDate: false
    };
  },

  componentWillMount: function () {
    this.setState({
      date: this.props.date,
      endDate: this.props.endDate
    });
  },

  render: function () {
    return (
        <DayPicker ref="daypicker"
                   enableOutsideDays={true}
                   initialMonth={moment(this.state.date)}
                   numberOfMonths={1}
                   modifiers={this.calendarOptions()}
                   onDayClick={this.selectDay}
                   onDayTouchTap={this.selectDay}/>
    );
  }
});

module.exports = DatePicker;
