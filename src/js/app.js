var React = require('react/addons');
var Parse = require('parse').Parse;

Parse.initialize(
    "<!-- substitute:applicationId -->",
    "<!-- substitute:javascriptId -->"
);

if ('ontouchstart' in document) {
  var fastclick = require('fastclick');
  fastclick(document.body);

  document.body.className += ' has-touch';
}

var Events = require('./components/Events/Events');
React.render(<Events />, document.getElementById('app'));