define([
    'jquery',
    'underscore',
    'backbone',
    'moment',
    'bootstrap',
    'datetimepicker',
    'json2'
], function($, _, Backbone, moment){
    $('#datetimepicker1').datetimepicker({
        language: 'fi',
        defaultDate: getMonday(),
    });
    
    $('.dropdown-toggle').dropdown();
    
    // Using finnish locale
    moment.locale("fi");
    
    /* Enable when storing week menus to localstorage
    var weekNumber = localStorage.getItem("weekNumber");
    var currWeekNumber = moment().format("w");
    //console.log("moment.w=" + moment().format("w"));
    if (weekNumber) {
        // If current week is different than what stored
        // Reset the stored data so we fetch current data
        if (weekNumber !== currWeekNumber) {
            localStorage.clear();
        }
    } else {
        localStorage.setItem("weekNumber", currWeekNumber);
    }
    */
    
    //localStorage.clear();
    
    //var amica_endpoint_root = 'http://www.amica.fi/modules/json/json/Index?';
    //var costNumber='3238';
    //var firstDay=moment($('#datetimepicker1').data("DateTimePicker").getDate()).format('YYYY-MM-DD');
    //var lastDay=moment($('#datetimepicker2').data("DateTimePicker").getDate()).format('YYYY-MM-DD');
    //var amica_endpoint = amica_endpoint_root + 'costNumber=' + costNumber + '&firstDay=' + firstDay + '&lastDay=' + lastDay + '&language=' + language;
    // http://www.amica.fi/api/restaurant/menu/week?language=fi&restaurantPageId=7303&weekDate=2014-8-30
    var amica_endpoint_root = 'http://www.amica.fi/api/restaurant/menu/week?';
    var restaurantPageId = localStorage.getItem("restaurantPageId");
    if (!restaurantPageId) {
        restaurantPageId = "7256";
    }
    var restaurant = localStorage.getItem("restaurant");
    if (!restaurant) {
        restaurant = "Itämeri";
    }
    /*
    var template = _.template($('#tpl-header').html(), {restaurant: "restaurant"});
    $('.header').html(template);
    */
    
    var Restaurant = Backbone.Model.extend({
        defaults: {
            PageLinkId: "7256",
            ShortTitle: 'Itämeri',
            StreetAddress: "Itämerenkatu 3",
            City: "Helsinki",
            PostalCode: "00180"
            // MainText
            // Url
        }
    });
    
    var RestaurantView = Backbone.View.extend({
        el: '.header',

        initialize:function(){
            this.render();
        },
        template:_.template($('#tpl-header').html()),
        
        render: function () {
            this.$el.html(this.template(this.model.toJSON()));
        }
    });
    var restaurant = new Restaurant;
    var restaurantView = new RestaurantView({ model: restaurant });
    
    var weekDate = firstDay=moment($('#datetimepicker1').data("DateTimePicker").getDate()).format('YYYY-MM-DD');
    var language = localStorage.getItem("language");
    if (!language) {
        language = "fi";
    }
    var amica_endpoint = createAmicaEndpoint();
    
    // Build lang dropdown
    var builddata = function () {
        var items = [];
        items[0] = { label: "fi", id: "fi" };
        items[1] = { label: "en", id: "en" };
        return items;
    }

    var buildUL = function (parent, items) {
        $.each(items, function () {
            var li = $("<li class='js-menu'>" + "<a href='#restaurant/"+ restaurantPageId + "/"+ this.id + "'>" + this.label + "</a></li>");
            li.appendTo(parent);
        });
    }

    var source = builddata();
    var ul = $(".json-lang-menu");
    ul.appendTo(".json-lang-menu");
    buildUL(ul, source);
    //add bootstrap classes
    if ($(".json-lang-menu>li:has(ul.js-menu)")) {
        $(".language-btn:first-child").text(language);
        $(".language-btn:first-child").val(language);
    }
    // Language menu
    
    // Get list of restaurants from Amica API
    var amica_restaurant_endpoint = "http://www.amica.fi/api/search/FindSearchResults/" + language + "?page=1&pageSize=200&query=&tagId=4527,4287"
    var restaurantsPromise = getRestaurants();
    
    restaurantsPromise.done(function(found, data){
        if (!found) {
            localStorage.setItem("restaurants", JSON.stringify(data));
            console.log("Fetching restaurants from Amica, found " + data.length)
        }
        restaurants = data;
                    
        //console.log("response=" + JSON.stringify(response));
        
        var builddata = function () {
            var items = [];
            for (i = 0; i < restaurants.length; i++) {
                var item = restaurants[i];
                var ShortTitle = item["ShortTitle"];
                var PageLinkId = item["PageLinkId"];
                items[i] = { label: ShortTitle, id: PageLinkId };
            }
            return items;
        }

        var buildUL = function (parent, items) {
            $.each(items, function () {
                var li = $("<li class='js-menu'>" + "<a href='#restaurant/"+ this.id +"'>" + this.label + "</a></li>");
                li.appendTo(parent);
            });
        }

        var source = builddata();
        var ul = $(".json-menu");
        ul.appendTo(".json-menu");
        buildUL(ul, source);
        //add bootstrap classes
        if ($(".json-menu>li:has(ul.js-menu)")) {
            $(".restaurant-btn:first-child").text(restaurants[0].ShortTitle);
            $(".restaurant-btn:first-child").val(restaurants[0].ShortTitle);
        }
    });

    restaurantsPromise.fail(function(status, error){
        console.log("status=" + status + "; error=" + error);
    });
    
    function createAmicaEndpoint() {
        return amica_endpoint_root + 'restaurantPageId=' + restaurantPageId + '&weekDate=' + weekDate + '&language=' + language;
    }
    
    // http://www.amica.fi/modules/json/json/Index?costNumber=3238&firstDay=2014-08-18&lastDay=2014-08-24&language=fi
    
    // Action for getting menu for given time period
    $('.getMenu').click(function() {
        weekDate=moment($('#datetimepicker1').data("DateTimePicker").getDate()).format('YYYY-MM-DD');
        // TODO:
        // Rajapinta ei tarjoa historiaa ruokalistoista.
        // Tallenna viikottaiset ruokalistat tietokantaan ja hae vanhemmat listat sieltä
        amica_endpoint = createAmicaEndpoint();
    });
    
    function getMonday() {
        var d = moment().startOf('isoWeek').format("YYYY-MM-DD");
        return d;
    }

    (function() {
        var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
        Date.prototype.getDayName = function() {
            return days[ this.getDay() ];
        };
    })();

    // Models
    var Menu = Backbone.Model.extend();

    // Collection of menus. 
    var WeekMenuCollection = Backbone.Collection.extend({
        model: Menu,
        parse: function(response) {
            //console.log(JSON.stringify(response));
            return response.LunchMenus;
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
                    weekDay = data.DayOfWeek;
                    date = data.Date;
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
            '' : 'showWeekMenu',
            'restaurant/:id' : 'showWeekMenu',
            'restaurant/:id/:lang' : 'showWeekMenu',
        },
        initialize : function() {
        },

        showWeekMenu : function(id, lang) {
            if (id) {
                restaurantPageId = id;
            }
            if (lang) {
                language = lang;
                localStorage.setItem("language", language);
                
                $(".language-btn:first-child").text(language);
                $(".language-btn:first-child").val(language);
            }

            this.weekMenuCollection = new WeekMenuCollection();
            this.weekMenuCollection.url = createAmicaEndpoint();
            var self = this;

            /* Enable when storing week menus to localstorage
            var restaurantMenu = localStorage.getItem("restaurantMenu." + restaurantPageId);
            if (restaurantMenu) {
                console.log("Getting menu from localStorage for id=" + restaurantPageId);
                //console.log("Menu for id=" + restaurantPageId + "; " + restaurantMenu);
                restaurantMenu = JSON.parse(restaurantMenu);
                this.weekMenuCollection.fetch({function(restaurantMenu)) {
                }
                self.weekMenuView = new WeekMenuView({
                    model:self.weekMenuCollection
                });
                $('.menus', this.el).html(self.weekMenuView.render().el);

                // toggle shown week day's menu
                var weekDayClass = '.'+new Date().getDayName();
                $('.day').find('.items').hide();
                $(weekDayClass).find('.items').show();
            } else {
            */
            console.log("Fetching menu from Amica for id=" + restaurantPageId);

            var weekMenuPromise = this.weekMenuCollection.fetch({
                success: function(response, xhr) {
                    //console.log("success=" + xhr.status);
                    //console.log("response=" + JSON.stringify(response)); // data element only
                    //console.log("xhr=" + JSON.stringify(xhr)); // full response
                    //localStorage.setItem("restaurantMenu." + restaurantPageId, JSON.stringify(response));

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
            //}
            
            weekMenuPromise.done(function () { 
                if (restaurantPageId) {
                    localStorage.setItem("restaurantPageId", restaurantPageId);
                    
                    restaurantsPromise.done(function() {
                        // Set selected restaurant
                        $.each(restaurants, function() {
                            if (restaurantPageId === this.PageLinkId) {
                                $(".restaurant-btn:first-child").text(this.ShortTitle);
                                $(".restaurant-btn:first-child").val(this.ShortTitle);
                                
                                restaurant = new Restaurant({
                                    "PageLinkId": this.PageLinkId,
                                    "ShortTitle": this.ShortTitle,
                                    "StreetAddress": this.StreetAddress,
                                    "City": this.City,
                                    "PostalCode": this.PostalCode
                                });
                                restaurantView = new RestaurantView({ model: restaurant });
                            }
                        });
                    });
                }
            });
        }
    });

    var initialize = function(){
        var router = new Router();
        Backbone.history.start();
    }
    
    function getRestaurants() {
        var deferred = $.Deferred();
        
        var restaurantsJson = localStorage.getItem("restaurants");
        if (restaurantsJson) {
            var restaurants = JSON.parse(restaurantsJson);
            console.log("Reading restaurants from localStorage, found " + restaurants.length);
            deferred.resolve(true, restaurants);
            return deferred.promise();
        }
        
        var req = new XMLHttpRequest;
        req.open("GET", amica_restaurant_endpoint);
        req.onreadystatechange = function() {
            if (req.readyState === XMLHttpRequest.DONE) {
                if (req.status == 200 ) {
                    //console.debug("200: " + req.responseText);
                    var jsonObject = JSON.parse(req.responseText);
                    restaurants = filterRestaurants(jsonObject);
                    deferred.resolve(false, restaurants);
                } else {
                    deferred.reject(req.status, req.responseText);
                }
            }
        }

        req.send();
        
        return deferred.promise();
    }
    
    return {
        initialize: initialize
    };
    
    function filterRestaurants(data) {
        // Response contains all kinds of data so we filter it to have only restaurants.
        var restaurants = data.Hits.filter(function (row) {
            if(row.Type === "restaurant") {
                return true
            } else {
                return false;
            }
        });

        return restaurants;
    }
});

