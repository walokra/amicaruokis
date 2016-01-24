define([
  'jquery',
  'underscore',
  'backbone',
  'views/weekmenu'
], function($, _, Backbone, ProjectListView, UserListView){
  var AppRouter = Backbone.Router.extend({
    routes: {
      '': 'listWeekMenu'
    }
  });

  var initialize = function(){
    var app_router = new AppRouter;
    app_router.on('listWeekMenu', function(){
      // Call render on the module we loaded in via the dependency array
      // 'views/weekmenu'
      var weekMenuView = new weekMenuView();
      weekMenuView.render();
    });
    Backbone.history.start();
  };
  return {
    initialize: initialize
  };
});
