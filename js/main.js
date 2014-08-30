// Require.js allows us to configure shortcut alias
// There usage will become more apparent further along in the tutorial.
require.config({
    paths: {
        jquery: 'libs/jquery.min',
        underscore: 'libs/underscore-min',
        backbone: 'libs/backbone',
        json2: 'libs/json2',
        moment: 'libs/moment.min',
        bootstrap: 'libs/bootstrap.min',
        datetimepicker: 'libs/bootstrap-datetimepicker.min'
    },
    shim: {
        'bootstrap': {
            deps: ['jquery', 'underscore']
        }
    }
});

require([
    // Load our app module and pass it to our definition function
    'app',
], function(App){
    // The "app" dependency is passed in as "App"
    App.initialize();
});
