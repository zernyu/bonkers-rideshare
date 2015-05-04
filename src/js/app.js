var React = require('react/addons');
var Parse = require('parse').Parse;

Parse.initialize(
    "<!-- substitute:applicationId -->",
    "<!-- substitute:javascriptId -->"
);

var fastclick = require('fastclick');
fastclick(document.body);

var Events = require('./components/Events/Events');
React.render(<Events />, document.getElementById('app'));