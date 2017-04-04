define(
    [
        'knockout',
        'appConfig',
        'area',
        'place',
        'navigation',
        'section',
        'searchBox',
        'searchResults'
    ],
    function (ko, appConfig, Area, Place) {

        var appViewModel = {
            brand: appConfig.name,
            account: appConfig.fq_token,
            queryTerm: ko.observable(''),
            queryResult: ko.observable(),
            filter: {
                active: ko.observable('All'),
                list: ko.observableArray(),
                render: ko.observable(false)
            }
        };


        /**
        * Manipulates Foursquare's response to get the value for the properties categories and address.
        * @see https://developer.foursquare.com/docs/responses/venue
        */
        appViewModel.setPlaceDetails = ko.computed(function () {
            if (appViewModel.queryResult()) {
                ko.utils.arrayForEach(appViewModel.queryResult().places(), function (venue) {

                    // Set category
                    if (venue.categories.length < 1) {
                        venue.categories = 'Other';
                    } else {
                        venue.categories = venue.categories[0].name;
                    }

                    // Set address
                    if (venue.location.address !== undefined) {
                        venue.address = venue.location.address + ', ' + venue.location.postalCode;
                    } else if (venue.location.state !== undefined) {
                        venue.address = venue.location.state;
                    } else {
                        venue.address = venue.location.country;
                    }
                });
                appViewModel.setPlacesList();
            }
        });

        /**
        * Helper function that resets the property "checked", which is the property we used to mark a determined
        * place as active.
        * @see markPlace(), filteredPlacesList()
        */
        appViewModel.unmarkPlaces = function () {
            var venues = appViewModel.queryResult().places();

            for (var i = 0; i < venues.length; i++) {
                venues[i].checked(false);
            }
        };

        /**
        * Helper function that receives the click event that allows to select a place from the list
        * @see markPlace(), filteredPlacesList()
        */
        appViewModel.markPlace = function (data) {
            appViewModel.unmarkPlaces();
            data.checked(true);
        };


        /**
        * Helper function that receives a click event and sets the visibility of the DOM element that contains
        * the list of filters
        * @see setFilter(), applyFilter()
        */
        appViewModel.getFilters = function (data) {
            if (data.render()) {
                data.render(false);
            } else {
                data.render(true);
            }
        };

        /**
        * Helper function that receives a click event and sets the value of the filter.active property
        * @see applyFilter()
        */
        appViewModel.setFilter = function (data) {
            appViewModel.filter.active(data);
        };


        /**
        * Helper function that implements the filtering feature. And so it takes two arguments: an array that
        * represents the list to be filtered, and the value of the filter.
        * @return a list of venues that match the given filter
        */
        appViewModel.applyFilter = function (list, filter) {
            if (filter !== 'All') {
                var filteredList = ko.utils.arrayFilter(list, function (item) {
                    return item.category === filter;
                });
                return filteredList;
            }
            return list;
        };

        /**
        * Prepares the filtered list
        * @see unmarkPlaces(), applyFilter()
        */
        appViewModel.filteredPlacesList = ko.computed(function () {
            if (appViewModel.queryResult()) {
                appViewModel.unmarkPlaces();
                return appViewModel.applyFilter(appViewModel.queryResult().places(), appViewModel.filter.active());
            }
        });

        /**
        * Helper function that prepares the query to be executed and reset the filters
        * @see models>account>getToken()
        */
        appViewModel.getArea = function () {
            appViewModel.queryResult(new Area({
                name: appViewModel.queryTerm()
            }));
            appViewModel.queryResult().setLocation();
            appViewModel.filter.list.removeAll();
            appViewModel.filter.list.push('All');
            appViewModel.filter.active('All');
        };


        /**
        * Gets Foursquare credentials via token flow
        * @see models>account>getToken()
        */
        appViewModel.getToken = function () {
            window.location.href = 'https://foursquare.com/oauth2/authenticate?client_id=' +
                                    appConfig.keys.fq + '&response_type=token&redirect_uri=' + appConfig.domain;
        };

        /**
        * Manages the keyboard event that triggers the search
        */
        appViewModel.getQueryTerm = function (data, event) {
            if (event.charCode === 13) {
                if (this.queryTerm() === '') {
                    alert('Hmm... Did you type something?');
                    this.queryResult().status('NO_RESULTS_FOUND');
                } else {
                    this.getArea();
                }
            }
        };

        /**
        * Defines the list of options to be use on the filtering feature, by extracting the unique categories
        * from the results list
        */
        appViewModel.renderFiltersList = function () {
            ko.utils.arrayForEach(this.queryResult().places(), function (place) {
                if (appViewModel.filter.list.indexOf(place.category) === -1) {
                    appViewModel.filter.list.push(place.category);
                }
            });
            appViewModel.filter.list.sort();

        };

        /**
        * Manipulates Foursquare's response and creates a custom object Place for each result, which is our custom
        * entity for handle this data.
        */
        appViewModel.setPlacesList = function () {
            var processedList = [];

            ko.utils.arrayForEach(appViewModel.queryResult().places(), function (place) {
                processedList.push(new Place({
                    title: place.name,
                    location: {
                        lat: place.location.lat,
                        lng: place.location.lng
                    },
                    address: place.address,
                    activity: {
                        hereNow: place.hereNow.summary,
                        checkins: place.stats.checkinsCount
                    },
                    category: place.categories,
                    website: 'https://foursquare.com/v/' + place.name + '/' + place.id
                }));
            });
            appViewModel.queryResult().places(processedList);
            appViewModel.renderFiltersList();
        };


        /**
        * Sets a default criteria for the search and calls the function that performs the search
        * @see appViewModel.getArea()
        */
        appViewModel.setQueryTerm = ko.computed(function () {
            if (appViewModel.account() && !appViewModel.queryResult()) {
                appViewModel.queryTerm('London');
                appViewModel.getArea();
            }
        });

        return appViewModel;
    }
);
