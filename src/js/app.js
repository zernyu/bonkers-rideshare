Parse.initialize(
    "<!-- substitute:applicationId -->",
    "<!-- substitute:javascriptId -->"
);

var Events = require('./components/Events');
React.render(<Events />, document.getElementById('app'));