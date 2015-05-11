'use strict';

var React = require('react');
var Parse = require('parse').Parse;

Parse.initialize(
    "<!-- substitute:applicationId -->",
    "<!-- substitute:javascriptId -->"
);

var App = require('./mobile/App');
React.render(<App />, document.getElementById('app'));