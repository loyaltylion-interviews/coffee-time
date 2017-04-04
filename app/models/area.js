define(
    [
        'knockout',
        'appConfig',
        'utils/date'
    ],
    function (ko, appConfig, today) {

        /**
         * Represents a query by location
         */

        function Area(data) {
            this.name = ko.observable(data.name);
            this.location = ko.observable(data.location);
            this.places = ko.observableArray(data.places);
            this.status = ko.observable(data.status);
        }

        /**
         * Call to Google Geolocation API and requests the geographic coordinates (location) of a given locality (title)
         * @see https://developers.google.com/maps/documentation/geocoding/intro
         */
        Area.prototype.setLocation = function () {
            var self = this;
            var url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' +
                    self.name() + '&key=' + appConfig.keys.googleGeo;

            $.getJSON(url)
                .done(function (data) {
                    if (data.status === 'OK') {
                        self.name(data.results[0].formatted_address);
                        self.location({
                            lat: data.results[0].geometry.location.lat,
                            lng: data.results[0].geometry.location.lng
                        });
                        self.setPlaces();
                    } else if (data.status === 'ZERO_RESULTS') {
                        self.status('NO_RESULTS_FOUND');
                    }
                }).fail(function () {
                    self.status('REQUEST_ERROR');
                    self.location();
                });
        };

        /**
         * Call to Foursquare's API and requests the venues for a given location (geographic coordinates) and
         * category (coffee places)
         * @see https://developer.foursquare.com/docs/venues/search
         */
        Area.prototype.setPlaces = function () {
            var self = this;
            var url = 'https://api.foursquare.com/v2/' + 'venues/search?ll=' + self.location().lat + ',' +
                    self.location().lng + '&oauth_token=' + window.localStorage.fq_token + '&query=coffee' + '&v=' + today;

            $.getJSON(url)
                .done(function (data) {
                    if (data.response.venues.length > 0) {
                        self.status('RESULTS_FOUND');
                        self.places(data.response.venues);
                    } else {
                        self.status('NO_RESULTS_FOUND');
                    }
                }).fail(function () {
                    self.status('REQUEST_ERROR');
                });
        };


        return Area;
    }
);
