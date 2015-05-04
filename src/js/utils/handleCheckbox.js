module.exports = function (checkbox) {
  var checkboxNode = this.refs[checkbox].getDOMNode();
  checkboxNode.checked = !checkboxNode.checked;

  var checkState = {};
  checkState[checkbox] = checkboxNode.checked;
  this.setState(checkState);
};