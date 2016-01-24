// Require.js allows us to configure shortcut alias
// There usage will become more apparent further along in the tutorial.
require.config({
  paths: {
    jquery: 'libs/jquery-2.0.3.min',
    underscore: 'libs/underscore-1.5.2-min',
    backbone: 'libs/backbone-1.1.2-min',
    json2: 'libs/json2',
    bootstrap: 'libs/bootstrap.min',
    moment: 'libs/moment.min'
  }
});

require([
  // Load our app module and pass it to our definition function
  'app',
], function(App){
  // The "app" dependency is passed in as "App"
  App.initialize();
});

