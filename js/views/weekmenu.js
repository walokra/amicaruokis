// http://www.amica.fi/modules/json/json/Index?costNumber=3238&firstDay=2014-08-18&lastDay=2014-08-24&language=fi
var amica_endpoint = 'http://www.amica.fi/modules/json/json/Index?';
var costNumber='3238';
var firstDay=getMonday();
var lastDay=getSunday();
var language='fi';

amica_endpoint = amica_endpoint + 'costNumber=' + costNumber + '&firstDay=' + firstDay + '&lastDay=' + lastDay + '&language=' + language;

define([
    'jquery',
    'underscore',
    'backbone',
    'json2',
    'moment',
    // Pull in the Collection module
    'collections/week',
    // Using the Require.js text! plugin, we are loaded raw text
    // which will be used as our views primary template
    //'text!templates/weekmenu.html'
], function($, _, Backbone, WeekMenuCollection, weekMenuTemplate){
    var WeekMenuView = Backbone.View.extend({
        initialize:function () {
            this.collection = new WeekMenuCollection();
            this.collection.url = amica_endpoint;
            var self = this;

            //
            // Fetching gallery data from REST API
            //
            this.collection.fetch({
                success: function(response, xhr) {
                    //console.log("success=" + xhr.status);
                    //console.log("response=" + JSON.stringify(response)); // data element only
                    //console.log("xhr=" + JSON.stringify(xhr)); // full response
                    self.weekMenuView = new WeekMenuView({
                        model:self.collection
                    });
                    $('.menus', this.el).html(self.weekMenuView.render().el);

                    // toggle shown week day's menu
                    var weekDayClass = '.'+currWeekDay;
                    $('.day').find('.items').hide();
                    $(weekDayClass).find('.items').show();
                },
                error: function(response, xhr) {
                    console.log("xhr=" + JSON.stringify(xhr));
                    $('div', this.el).append(response);
                }
            });
            
            this.model.bind("reset", this.render, this); // render after collection is reset
        },

        events: {
            'click .day' :'toggleEvent'
        },
        toggleEvent: function (e) {
            //console.log(e.currentTarget.className);
            $(e.currentTarget).find('.items').toggle("", function() {});
        },

        render:function (event) {
            this.$el.empty(); // we don't want any old stuff there if we render this multiple times.
            //loop through each model, and render them separately
            _.each(this.model.models, this.renderOne, this);

            return this;
        },
        renderOne : function(data) {
            //console.log(JSON.stringify(data))
            // init the ImageView and passed in its model here
            var attributes = data.toJSON();
            var date = attributes.Date;
            data.date = date;

            var view = new WeekMenuItemView({
                model : data
            });
            this.$el.append(view.render().el);
        }
    });

    var weekDay;
    var date;
    var i=0;

    var WeekMenuItemView = Backbone.View.extend({  
        initialize : function() {
        },

        template:_.template($('#tpl-day').html()),

        render : function() {
            //console.log("render=" + JSON.stringify(this.model.toJSON()));
            //loop through each model, and render them separately
            _.each(this.model, this.renderOne, this);
            return this;
        },
        renderOne : function(data) {
            //console.log("renderOne=" + JSON.stringify(data))

            //_.each(data.SetMenus, this.renderMenu, this);

            _.each(data.SetMenus, function (list) {
                if (i === 0) {
                    weekDay = new Date(data.Date).getDayName();
                    //date = moment(data.Date).format("D.M.");
                    i++;
                    this.$el.html(this.template(weekDay));
                    this.$el.html(this.template(date));
                } else {
                    weekDay = "";
                }

                $(this.el).addClass(weekDay).addClass('day').html(); 
                $(this.el).append(new ComponentView({model:list}).render().el);
            }, this);
            i=0;

            return this;
        }
    });

    var ComponentView = Backbone.View.extend({
        className  : 'items',

        initialize : function() {

        },

        template:_.template($('#tpl-menus').html()),

        render : function() {
            //console.log("ComponentView: " + JSON.stringify(this.model));
            var comps = this.model.Components;
            this.$el.html(this.template(this.model));

            return this;
        }
    });
    
    // Our module now returns our view
    return WeekMenuView;
});

function getMonday() {
    var d = "2014-08-18"; //moment().startOf('isoWeek').format("YYYY-MM-DD");
    return d;
}

function getSunday() {
    var d = "201-08-24"; //moment().endOf('isoWeek').format("YYYY-MM-DD");
    return d;
}

(function() {
    var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

    var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

    Date.prototype.getMonthName = function() {
        return months[ this.getMonth() ];
    };
    Date.prototype.getDayName = function() {
        return days[ this.getDay() ];
    };
})();


var currWeekDay = new Date().getDayName();
//console.log("currWeekDay=" + currWeekDay);

(function() {
    var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    Date.prototype.getDayName = function() {
        return days[ this.getDay() ];
    };
})();