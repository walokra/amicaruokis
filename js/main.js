// Require.js allows us to configure shortcut alias
// There usage will become more apparent further along in the tutorial.
require.config({
    paths: {
        jquery: 'lib/jquery-2.0.3.min',
        underscore: 'lib/underscore-1.6.0-min',
        backbone: 'lib/backbone-1.1.2-min',
        json2: 'lib/json2',
        moment: 'lib/moment.min'
    }
});

require([
    // Load our app module and pass it to our definition function
    'app',
], function(App){
    // The "app" dependency is passed in as "App"
    App.initialize();
});
