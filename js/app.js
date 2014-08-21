define([
    'jquery',
    'underscore',
    'backbone',
    'json2',
    'moment'
], function($, _, Backbone, JSON, moment){
    // http://www.amica.fi/modules/json/json/Index?costNumber=3238&firstDay=2014-08-18&lastDay=2014-08-24&language=fi
    var amica_endpoint = 'http://www.amica.fi/modules/json/json/Index?';
    var costNumber='3238';
    var firstDay=getMonday();
    var lastDay=getSunday();
    var language='fi';
    
    var amica_endpoint = amica_endpoint + 'costNumber=' + costNumber + '&firstDay=' + firstDay + '&lastDay=' + lastDay + '&language=' + language;

    function getMonday() {
        var d = moment().startOf('isoWeek').format("YYYY-MM-DD");
        return d;
    }

    function getSunday() {
        var d = moment().endOf('isoWeek').format("YYYY-MM-DD");
        return d;
    }

    (function() {
        var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
        Date.prototype.getDayName = function() {
            return days[ this.getDay() ];
        };
    })();

    /*
    {
      "RestaurantName": "Piikeidas",
      "RestaurantUrl": "http://www.amica.fi/ravintolat/ei-avoimet-ravintolat/piikeidas/",
      "PriceHeader": null,
      "Footer": "Hyvät asiakkaat!\n\nRavintola piikeidas on avoinna ajalla 23.6-8.8.14, ma-pe klo 7.30-14.30.\n\nLounas on tarjolla klo 10.30-13.00.\n\nGrilli on suljettuna.\n\n\n\nHyvää ruokahalua!",
      "MenusForDays": [
        {
          "Date": "2014-08-18T00:00:00",
          "SetMenus": [
            {
              "Name": null,
              "Price": null,
              "Components": [
                "Katkarapu-kookoskastiketta (L ,G ,M ,A)",
                "Jasminriisiä (L ,G ,M)",
                "Jauhelihapyöryköitä (L ,M ,A)",
                "Kermaperunoita (L ,G)",
                "Täyteläistä mustapippurikastiketta (L ,G ,A)",
                "Raastepihvejä (L ,M ,* ,A)",
                "Tomaatti-kikhernehöystöä (L ,G ,M)",
                "Kikhernekeittoa (L ,G ,M ,Veg ,A)",
                "Raparperi-kaurapaistosta (L ,M ,A)",
                "Vaniljakastiketta (G ,VL ,A)",
                "Take away: Katkarapusalaatti ()",
                "Ruokasalaatti: Sitrusmarinoituja katkarapuja (A, G, L, M), Raejuustoa (G, L) ()"
              ]
            },
            {
              "Name": null,
              "Price": null,
              "Components": [
                "Naudanlihawok, chiliä, inkivääriä ja kasviksia (L ,G ,M ,VS ,A)"
              ]
            }
          ]
        },
        {
          "Date": "2014-08-19T00:00:00",
          "SetMenus": [
            {
              "Name": null,
              "Price": null,
              "Components": [
                "Pippurista naudanlihakastiketta (L ,G ,A)",
                "Keitettyjä perunoita (L ,G ,M ,*)",
                "Broileri-ananaspannupizzaa (L ,A)",
                "Valkosipulimurskaa (L ,G ,M ,VS)",
                "Quorn -pyttipannua (L ,G ,M ,* ,A)",
                "Täyteläistä sellerisosekeittoa (L ,G ,A)",
                "Karviaiskiisseliä (L ,G ,M ,Veg)",
                "Vaniljakermavaahtoa (L ,G ,A)",
                "Take away: Vuohenjuustosalaatti ()",
                "Ruokasalaatti: Tandoorimarinoitua broileria (G, L, M), Palvikinkkua (L, M, G) ()"
              ]
            },
            {
              "Name": null,
              "Price": null,
              "Components": [
                "Porsaan grillipihvi (L ,G ,M)",
                "Paahdettuja lohkoperunoita (L ,G ,M ,Veg)",
                "Barbecuekastiketta (L ,G ,M ,Veg)"
              ]
            }
          ]
        }
       ]
    }
    */

    // Models
    var Menu = Backbone.Model.extend();

    // Collection of menus. 
    var WeekMenuCollection = Backbone.Collection.extend({
        model: Menu,
        parse: function(response) {
            //console.log(JSON.stringify(response));
            return response.MenusForDays;
        }
    });

    //
    // Views
    //

    // Default eventsview for events collection's view
    var WeekMenuView = Backbone.View.extend({
        tagName : 'div',
        initialize:function () {
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


    var i=0;

    var WeekMenuItemView = Backbone.View.extend({
        tagName  : 'div',

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

            _.each(data.SetMenus, function (list) {
                if (i === 0) {
                    weekDay = new Date(data.Date).getDayName();
                    date = moment(data.Date).format("D.M.");
                    i++;
                    this.$el.html(this.template(weekDay));
                    this.$el.html(this.template(date));
                    $(this.el).addClass(weekDay).addClass('day').html(); 
                }

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
    
    
    //
    // Fetching gallery data from REST API
    //

    var weekMenuView;

    var Router = Backbone.Router.extend({
        routes : {
            '' : 'showWeekMenu'
        },
        initialize : function() {
        },

        showWeekMenu : function() {
            //console.log("showWeekMenu");
            // Instantiating 
            this.weekMenuCollection = new WeekMenuCollection();
            this.weekMenuCollection.url = amica_endpoint;
            var self = this;

            this.weekMenuCollection.fetch({
                success: function(response, xhr) {
                    //console.log("success=" + xhr.status);
                    //console.log("response=" + JSON.stringify(response)); // data element only
                    //console.log("xhr=" + JSON.stringify(xhr)); // full response
                    self.weekMenuView = new WeekMenuView({
                        model:self.weekMenuCollection
                    });
                    $('.menus', this.el).html(self.weekMenuView.render().el);

                    // toggle shown week day's menu
                    var weekDayClass = '.'+new Date().getDayName();
                    $('.day').find('.items').hide();
                    $(weekDayClass).find('.items').show();
                },
                error: function(response, xhr) {
                    console.log("xhr=" + JSON.stringify(xhr));
                    $('div', this.el).append(response);
                }
            });
        }
    });

    var initialize = function(){
        var router = new Router();
        Backbone.history.start();
    }
    
    return {
        initialize: initialize
    };
});

