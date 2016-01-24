// Filename: collections/projects
define([
  'underscore',
  'backbone',
  // Pull in the Model module from above
  'models/menu'
], function(_, Backbone, MenuModel){
	var WeekMenuCollection = Backbone.Collection.extend({
		model: MenuModel,
		parse: function(response) {
			//console.log(JSON.stringify(response));
			return response.MenusForDays;
		}
	});
	// You don't usually return a collection instantiated
	return WeekMenuCollection;
});
