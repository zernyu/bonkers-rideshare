var _ = require('underscore');

var validateField = function (field, validationKey) {
  var validationError = undefined;

  if (field.props.validate) {
    var value = field.getDOMNode().value;
    if (_.isEmpty(value)) {
      validationError = 'You left this blank, doofus!';
    } else if (field.props.validationType === 'integer' && _.isNaN(parseInt(value))) {
      validationError = 'Enter a real number, doofus!';
    }
  }

  // Reset validation error if validation passes and validation error is being displayed
  if (validationError === undefined && this.state.validation[validationKey]) {
    validationError = false;
  }

  if (validationError !== undefined) {
    var validationState = this.state.validation;
    validationState[validationKey] = validationError;
    this.setState({ validation: validationState });
  }

  return !validationError;
};

module.exports = validateField;
