var React = require('react/addons');
var Parse = require('parse').Parse;

Parse.initialize(
    "<!-- substitute:applicationId -->",
    "<!-- substitute:javascriptId -->"
);

var Events = require('./components/Events/Events');
React.render(<Events />, document.getElementById('app'));