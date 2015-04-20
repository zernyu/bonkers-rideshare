var _ = require('underscore');
var React = require('react/addons');
var ParseReact = require('parse-react');
var moment = require('moment');
var classNames = require('classnames');
var DayPicker = require('react-day-picker');
var validateField = require('../../utils/validateField');

function isSameDay(a, b) {
  return a.startOf('day').isSame(b.startOf('day'));
}

var AddEventModal = React.createClass({
  mixins: [React.addons.LinkedStateMixin],

  closeModal: function () {
    React.unmountComponentAtNode(this.getDOMNode().parentNode);
  },

  handleCheckbox: function (checkbox) {
    var checkboxNode = this.refs[checkbox].getDOMNode();
    checkboxNode.checked = !checkboxNode.checked;

    var checkState = {};
    checkState[checkbox] = checkboxNode.checked;
    this.setState(checkState);
  },

  saveEvent: function () {
    var passed = _.every(this.refs, validateField, this);
    if (!passed) return;

    var event = {
      name: this.state.name,
      date: this.state.date,
      registrationUrl: this.state.registrationUrl,
      housingNeeded: this.state.housingNeeded
    };

    var save = this.props.event.objectId
        ? ParseReact.Mutation.Set(this.props.event, event)
        : ParseReact.Mutation.Create('Event', event);
    save.dispatch();

    this.closeModal();
  },

  selectDay: function (day, modifiers) {
    if (modifiers.indexOf('disabled') === -1) {
      this.setState({
        date: day.toDate()
      });
    }
  },

  getModifiers: function () {
    var modifiers = {
      today: function (day) {
        return isSameDay(moment(), day);
      },

      // disable past days
      disabled: function (day) {
        return day.diff(moment(), 'day') < 0;
      },

      selected: function (day) {
        var currentDate = moment(this.state.date);

        if (modifiers.disabled(day) || !currentDate) {
          // date may be null if not a valid date
          return false;
        }
        else {
          return isSameDay(currentDate, day);
        }
      }.bind(this)
    };
    return modifiers;
  },

  getInitialState: function () {
    return {
      date: new Date(),
      validation: {}
    };
  },

  componentWillMount: function () {
    var preloadState = this.props.event || {};
    this.setState(preloadState);
  },

  render: function () {
    var nameValidation = classNames('ui pointing red label', {'hidden': !this.state.validation.name});

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
                  <label>Registration URL <span className="optional">Optional</span></label>
                  <input type="text"
                         placeholder="https://www.bikereg.com/123456"
                         valueLink={this.linkState('registrationUrl')}/>
                </div>
                <div className="field">
                  <div className="ui checkbox">
                    <input type="checkbox"
                           ref="housingNeeded"
                           checkedLink={this.linkState('housingNeeded')}/>
                    <label onClick={this.handleCheckbox.bind(this, 'housingNeeded')}>
                      Overnight stay <span className="optional">Do we need housing?</span>
                    </label>
                  </div>
                </div>
                <div className="field">
                  <label>Date</label>
                  <DayPicker ref="daypicker"
                             enableOutsideDays={true}
                             initialMonth={moment(this.state.date)}
                             numberOfMonths={1}
                             modifiers={this.getModifiers()}
                             onDayClick={this.selectDay}
                             onDayTouchTap={this.selectDay}/>
                </div>
              </div>
              <div className="ui bottom attached segment">
                <div className="ui two fluid buttons">
                  <button className="ui button" onClick={this.closeModal}>Cancel</button>
                  <button className="ui right labeled positive icon button" onClick={this.saveEvent}>
                    Save event
                    <i className="right chevron icon"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
    );
  }
});

module.exports = AddEventModal;
