var _ = require('underscore');
var React = require('react/addons');
var ParseReact = require('parse-react');
var classNames = require('classnames');
var DatePicker = require('../common/DatePicker');
var handleCheckbox = require('../../utils/handleCheckbox');
var validateField = require('../../utils/validateField');

var AddEventModal = React.createClass({
  mixins: [React.addons.LinkedStateMixin],

  /***** MODAL FUNCTIONS *****/

  closeModal: function () {
    React.unmountComponentAtNode(this.getDOMNode().parentNode);
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

  /***** FORM INTERACTION *****/

  toggleHousing: function () {
    handleCheckbox.call(this, 'housingNeeded');

    if (this.state.housingNeeded && this.state.endDate) {
      this.setState({
        endDate: null,
        selectingEndDate: false
      });
    }
  },

  updateDate: function (date, endDate) {
    this.setState({
      date: date,
      endDate: endDate
    });
  },

  /***** LIFECYCLE FUNCTIONS *****/

  getInitialState: function () {
    return {
      date: new Date(),
      endDate: null,
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
              <div className="ui top attached form segment">
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
                  <label>Website <span className="optional">Optional</span></label>
                  <input type="text"
                         placeholder="https://www.bikereg.com/123456"
                         valueLink={this.linkState('registrationUrl')}/>
                </div>
                <div className="field">
                  <div className="ui checkbox">
                    <input type="checkbox"
                           ref="housingNeeded"
                           checkedLink={this.linkState('housingNeeded')}/>
                    <label onClick={this.toggleHousing}>
                      Overnight stay <span className="optional">Do we need housing?</span>
                    </label>
                  </div>
                </div>
                <div className="field">
                  <label>Date <span className="optional">{this.state.housingNeeded ? 'Choose a start and end day in the calendar.' : ''}</span></label>
                  <DatePicker onDatePicked={this.updateDate} date={this.state.date} endDate={this.state.endDate} />
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
