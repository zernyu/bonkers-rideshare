var _ = require('underscore');
var React = require('react/addons');
var Parse = require('parse').Parse;
var ParseReact = require('parse-react');
var classNames = require('classnames');
var validateField = require('../../utils/validateField');
var If = require('../common/If');
var DriverSelect = require('./DriverSelect');
var HostSelect = require('./HostSelect');

var AddAttendeeModal = React.createClass({
  mixins: [React.addons.LinkedStateMixin, ParseReact.Mixin],

  observe: function () {
    return {
      hosts: (new Parse.Query('Attendee'))
          .equalTo('eventId', this.props.eventId)
          .equalTo('hosting', true)
          .include('ridingWith')
          .include('roomingWith')
          .ascending('name'),

      drivers: (new Parse.Query('Attendee'))
          .equalTo('eventId', this.props.eventId)
          .equalTo('driving', true)
          .include('ridingWith')
          .include('roomingWith')
          .ascending('name')
    };
  },


  closeModal: function () {
    document.getElementsByTagName('html')[0].classList.remove('noscroll');
    document.body.classList.remove('noscroll');
    React.unmountComponentAtNode(this.getDOMNode().parentNode);
  },

  driving: function (driving) {
    this.setState({ driving: driving });
  },

  hosting: function (hosting) {
    this.setState({ hosting: hosting });
  },

  _getAttendee: function (objectId, resultKey) {
    var attendee = _.clone(this.data[resultKey].filter(function (attendee) { return attendee.objectId === objectId })[0]);
    if (attendee) attendee.__type = 'Pointer';
    return attendee;
  },

  saveAttendee: function () {
    var passed = _.every(this.refs, validateField, this);
    if (!passed) return;

    var driver = this.state.ridingWith ? this._getAttendee(this.state.ridingWith, 'drivers') : undefined;
    var host = this.state.roomingWith ? this._getAttendee(this.state.roomingWith, 'hosts') : undefined;

    var attendee = {
      eventId: this.props.eventId,
      name: this.state.name,
      notes: this.state.notes,
      races: this.state.races,

      driving: this.state.driving,
      carCapacity: this.state.driving ? parseInt(this.state.carCapacity) : undefined,
      ridingWith: !this.state.driving ? driver : undefined,

      hosting: this.state.hosting,
      hostingCapacity: this.state.hosting ? parseInt(this.state.hostingCapacity) : undefined,
      roomingWith: !this.state.hosting ? host : undefined
    };

    var save = this.props.attendee.objectId
        ? ParseReact.Mutation.Set(this.props.attendee, attendee)
        : ParseReact.Mutation.Create('Attendee', attendee);
    save.dispatch();

    if (this.props.attendee.ridingWith && !driver) {
      ParseReact.Mutation.Unset(this.props.attendee, 'ridingWith').dispatch();
    }

    if (this.props.attendee.roomingWith && !host) {
      ParseReact.Mutation.Unset(this.props.attendee, 'roomingWith').dispatch();
    }

    this.closeModal();
  },

  getInitialState: function () {
    return {
      validation: {}
    }
  },

  componentWillMount: function () {
    document.getElementsByTagName('html')[0].classList.add('noscroll');
    document.body.classList.add('noscroll');

    var preloadState = this.props.attendee || {};

    if (_.isObject(preloadState.ridingWith)) {
      preloadState.ridingWith = preloadState.ridingWith.objectId;
    }
    if (_.isObject(preloadState.roomingWith)) {
      preloadState.roomingWith = preloadState.roomingWith.objectId;
    }

    this.setState(preloadState);
  },

  render: function () {
    var drivingToggle = classNames('ui button', { 'blue active': this.state.driving });
    var ridingToggle = classNames('ui button', { 'blue active': !this.state.driving });
    var drivingForm = classNames('field group', { 'hidden': !this.state.driving });
    var ridingForm = classNames('field group', { 'hidden': this.state.driving });

    var hostingToggle = classNames('ui button', { 'blue active': this.state.hosting });
    var roomingToggle = classNames('ui button', { 'blue active': !this.state.hosting });
    var hostingForm = classNames('field group', { 'hidden': !this.state.hosting });
    var roomingForm = classNames('field group', { 'hidden': this.state.hosting });

    var nameValidation = classNames('ui pointing red label', { 'hidden': !this.state.validation.name });
    var carCapacityValidation = classNames('ui pointing red label', { 'hidden': !this.state.validation.carCapacity });
    var hostingCapacityValidation = classNames('ui pointing red label', { 'hidden': !this.state.validation.hostingCapacity });

    return (
        <div className="ui scrollable page dimmer transition visible animating fade in">
          <div className="ui small basic modal attendee content">
            <div className="ui basic segment">
              <div className="ui top attached form segment">
                <div className="field">
                  <label>Name</label>
                  <input type="text"
                         placeholder="Werner Mannmithammer"
                         ref="name"
                         validate={true}
                         valueLink={this.linkState('name')} />
                  <div className={nameValidation}>{this.state.validation.name}</div>
                </div>
                <div className="field">
                  <div className="ui two fluid buttons">
                    <div className={drivingToggle} onClick={this.driving.bind(this, true)}>
                      <i className="car icon"></i> Driving</div>
                    <div className={ridingToggle} onClick={this.driving.bind(this, false)}>
                      <i className="handicap icon"></i> Bumming</div>
                  </div>
                </div>
                <div className={drivingForm}>
                  <label>Car capacity</label>
                  <input type="tel"
                         placeholder="Number of riders (including yourself)"
                         ref="carCapacity"
                         validate={this.state.driving}
                         validationType="integer"
                         valueLink={this.linkState('carCapacity')} />
                  <div className={carCapacityValidation}>{this.state.validation.carCapacity}</div>
                </div>
                <div className={ridingForm}>
                  <label>Riding with</label>
                  <DriverSelect options={this.data.drivers} valueLink={this.linkState('ridingWith')} />
                </div>
                <If test={this.props.housingNeeded}>
                  <div className="field group">
                    <div className="field">
                      <div className="ui two fluid buttons">
                        <div className={hostingToggle} onClick={this.hosting.bind(this, true)}>
                          <i className="home icon"></i> Hosting</div>
                        <div className={roomingToggle} onClick={this.hosting.bind(this, false)}>
                          <i className="trash icon"></i> Bumming</div>
                      </div>
                    </div>
                    <div className={hostingForm}>
                      <label>Housing capacity</label>
                      <input type="tel"
                             placeholder="Number of people (including yourself) who can stay with you"
                             ref="hostingCapacity"
                             validate={this.state.hosting}
                             validationType="integer"
                             valueLink={this.linkState('hostingCapacity')}/>
                      <div className={hostingCapacityValidation}>{this.state.validation.hostingCapacity}</div>
                    </div>
                    <div className={roomingForm}>
                      <label>Rooming with</label>
                      <HostSelect options={this.data.hosts} valueLink={this.linkState('roomingWith')}/>
                    </div>
                  </div>
                </If>
                <div className="field">
                  <label>Notes</label>
                  <textarea placeholder="Leaving from Star Lounge at 8am, bringing a teddy bear" valueLink={this.linkState('notes')}></textarea>
                </div>
              </div>
              <div className="ui bottom attached segment">
                <div className="ui two fluid buttons">
                  <button className="ui button" onClick={this.closeModal}>Cancel</button>
                  <button className="ui right labeled blue icon button" onClick={this.saveAttendee}>
                    {this.props.attendee.objectId ? 'Update' : 'Join'}
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

module.exports = AddAttendeeModal;
