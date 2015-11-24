define([
    'jquery',
    'underscore',
    'backbone',
    'moment',
    'bootstrap',
    'datetimepicker',
    'json2'
], function($, _, Backbone, moment){
    var router;
    
    /* Not used for now
    $('#datetimepicker1').datetimepicker({
        language: 'fi',
        defaultDate: getMonday(),
    });
    */
    
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

    var amica_endpoint_root = 'http://www.amica.fi/api/restaurant/menu/week?';
    var restaurantPageId = localStorage.getItem("restaurantPageId");
    if (!restaurantPageId) {
        restaurantPageId = "5830";
    }
    var restaurant = localStorage.getItem("restaurant");
    if (!restaurant) {
        restaurant = "Piikeidas";
    }
    
    var piikeidas = {
        PageLinkId: "5830",
        ShortTitle: 'Piikeidas',
        StreetAddress: "Karvaamokuja 2",
        City: "Helsinki",
        PostalCode: "00380",
        // MainText
        Url: "http://www.amica.fi/ravintolat/ei-avoimet-ravintolat/piikeidas/"
    };
    
    //var weekDate = firstDay=moment($('#datetimepicker1').data("DateTimePicker").getDate()).format('YYYY-MM-DD');
    var weekDate = moment().format('YYYY-MM-DD');
    var language = localStorage.getItem("language");
    if (!language) {
        language = "fi";
    }
    var amica_endpoint = createAmicaEndpoint();
    // END variables
    
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
    if ($(".json-lang-menu>li:has(ul.js-menu)")) {
        $(".language-btn .item").text(language);
        $(".language-btn .item").val(language);
    }
    // Language menu
    
    // Get list of restaurants from Amica API
    var amica_restaurant_endpoint = "http://www.amica.fi/api/search/FindSearchResults?language=" + language + "&page=1&pageSize=200&query=&tagId=4527,4287"
    var restaurantsPromise = getRestaurants();
    
    restaurantsPromise.done(function(found, data){
        if (!found) {
            localStorage.setItem("restaurants", JSON.stringify(data));
            console.log("Fetching restaurants from Amica, found " + data.length)
        }
        restaurants = data;
        // Adding our hidden restaurant
        restaurants.push(piikeidas);
       
		// Creating array of restaurants
		// ShortTitle = Restaurant name e.g. Piikeidas
		// PageLinkId = Restaurant code to be used in amica site, e.g. 5830
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
            $(".restaurant-btn .item").text(restaurants[0].ShortTitle);
            $(".restaurant-btn .item").val(restaurants[0].ShortTitle);
        }
    });

    restaurantsPromise.fail(function(status, error){
        console.log("status=" + status + "; error=" + error);
    });
    
    function createAmicaEndpoint() {
        return amica_endpoint_root + 'restaurantPageId=' + restaurantPageId + '&weekDate=' + weekDate + '&language=' + language;
    }
    
    /* Useless for now
    // Action for getting menu for given time period
    $('.getMenu').click(function(e) {
        weekDate=moment($('#datetimepicker1').data("DateTimePicker").getDate()).format('YYYY-MM-DD');
        // TODO:
        // Rajapinta ei tarjoa historiaa ruokalistoista.
        // Tallenna viikottaiset ruokalistat tietokantaan ja hae vanhemmat listat sieltä
        amica_endpoint = createAmicaEndpoint();
    });
    */
    $('.getMenu').click(function(e) {
        restaurantPageId=$('#restaurant #restaurantPageId').val();
        url = _.escape("restaurant/" + restaurantPageId);
        router.navigate(url, {trigger: true});
    });
    
    /* With datetimepicker dropdowns
    function getMonday() {
        var d = moment().startOf('isoWeek').format("YYYY-MM-DD");
        return d;
    }
    */

    /*
    (function() {
        var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
        Date.prototype.getDayName = function() {
            return days[ this.getDay() ];
        };
        //String.prototype.capitalize = function() {
        //    return this.charAt(0).toUpperCase() + this.slice(1);
        //};
    })();
    */
    
    function capitalize(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    // Models
    var Menu = Backbone.Model.extend();

    var Restaurant = Backbone.Model.extend({
        defaults: piikeidas
    });
    
    // Collection of menus. 
    var WeekMenuCollection = Backbone.Collection.extend({
        model: Menu,
        parse: function(response) {
            return response.LunchMenus;
        }
    });

    //
    // Views
    //

	// Render restaurant info
    var RestaurantView = Backbone.View.extend({
        el: '.header',

        initialize:function(){
            this.render();
        },
        template:_.template($('#tpl-header').html()),
        
        render: function () {
			//console.log("json=", JSON.stringify(this.model.toJSON()));
            this.$el.html(this.template(this.model.toJSON()));
        }
    });
    var restaurant = new Restaurant;
    var restaurantView = new RestaurantView({ model: restaurant });
    
    // Default eventsview for events collection's view
    var WeekMenuView = Backbone.View.extend({
        tagName : 'div',
        initialize:function () {
            this.model.bind("reset", this.render, this); // render after collection is reset
        },

        events: {
            'click .day .toggle' :'toggleEvent'
        },
        toggleEvent: function (e) {
            //console.log(e.currentTarget.className);
            $(e.currentTarget).parent().find('.items').toggle(100, function() {});
        },

        render:function (event) {
            this.$el.empty(); // we don't want any old stuff there if we render this multiple times.
            _.each(this.model.models, this.renderOne, this);

            return this;
        },
        renderOne : function(data) {
			//console.log("data=", JSON.stringify(data.toJSON()));
            var attributes = data.toJSON();
            var date = attributes.Date;
            data.date = date;
			//console.log("date=", date);

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
			//console.log("model=", JSON.stringify(this.model));
			var data = this.model.toJSON();
            weekDay = data.DayOfWeek;
			date = data.Date;
			this.$el.html(this.template(weekDay));
			this.$el.html(this.template(date));
			$(this.el).addClass(weekDay).addClass('day').html();
			//console.log("weekDay=", weekDay, "; date=", date);

			//console.log("model=", JSON.stringify(this.model));
			$(this.el).append(new ComponentView({model:data}).render().el);

            return this;
        }
    });
   
	var ComponentView = Backbone.View.extend({
        className  : 'items',

        initialize : function() {

        },

        template:_.template($('#tpl-menus').html()),

        render : function() {
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
            if (lang && (lang === "en" || lang === "fi")) {
                language = lang;
                localStorage.setItem("language", language);

                $(".language-btn .item").text(language);
                $(".language-btn .item").val(language);
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
                    var weekDayClass = moment().format("dddd");
                    weekDayClass = '.' + capitalize(weekDayClass);
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
                                $(".restaurant-btn .item").text(this.ShortTitle);
                                $(".restaurant-btn .item").val(this.ShortTitle);
                                
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
        router = new Router();
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

