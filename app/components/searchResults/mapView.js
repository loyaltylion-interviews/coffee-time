define(
    [
        'knockout',
        'place',
        'searchResults'
    ],
    function (ko, Place) {

        ko.bindingHandlers.mapView = {
        /**
         * Custom binding to implement a map view for the search results
         * @param {Area} queryResult -  Represents the location query
         * @param {value}  filter - The active filter option
         */

            update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
            /**
             * Draw a map using GoogleMaps API for a given list of locations
             * @param {Object} element -  DOM Element
             * @param {Object} valueAccessor -  data passed to the binding (area, filter)
             * @param {Object} allBindings -  model bound to the DOM element(mapView)
             * @param {undefined} viewModel - deprecated
             * @param {Object} bindingContext -  data referenced to this binding
             * @see https://developers.google.com/maps/documentation/javascript/3.exp/reference
             */

                // Access the binding data
                var data = valueAccessor();
                var modelView = bindingContext.$root;

                // Load GoogleMaps API
                require(['async!gmaps'], function () {

                    var map;
                    var mapOptions;
                    var mapBounds;
                    var markerInfo = null;
                    var markersList = ko.observableArray();
                    var markersListFiltered;


                    function animateMarker(marker) {
                    /**
                     * Manage the marker animation
                     * @param {Object} marker -  googlemaps' marker object for the selected result
                     */
                        marker.setAnimation(google.maps.Animation.BOUNCE);
                        setTimeout(function () {
                            marker.setAnimation(null);
                        }, 700);
                    }

                    function renderMarkerDetails(marker, infoWindow) {
                    /**
                     * Manage the infoWindow object
                     * @param {Object} marker -  googlemaps' marker object for the selected result
                     * @param {Object} infoWindow -  an empty infoWindow
                     */
                        infoWindow.setContent(marker.content);
                        infoWindow.open(element, marker);
                    }

                    function renderMarker(result, infoWindow) {
                    /**
                     * Render the details for the selected result's marker
                     * @param {Object} result -  binding's marker object for the selected result
                     * @param {Object} infoWindow -  an empty infoWindow
                     */

                        // Watch the property that receives the click event from the listView.
                        result.status.subscribe(function (showMore) {
                            if (showMore) {
                                renderMarkerDetails(result.marker, infoWindow);
                                animateMarker(result.marker);
                            }
                        });

                        // Listens a click event for the mapView
                        result.marker.addListener('click', function () {
                            renderMarkerDetails(result.marker, infoWindow);
                            animateMarker(result.marker);
                        });
                    }

                    function renderMap(rawList, filteredList, infoWindow) {
                    /**
                     * Draw markers on the map for a given list of results
                     * @param {Array} markersList -  list of results
                     * @param {Object} infoWindow -  an empty infoWindow
                     */


                        // Clear map (markers and infoWindow)
                        ko.utils.arrayForEach(markersList(), function (result) {
                            infoWindow.close();
                            result.marker.setMap(null);
                        });

                        // Attach the markers from the filtered list on the map as well as sets the map bounds
                        ko.utils.arrayForEach(filteredList, function (result) {
                            result.marker.setMap(map);
                            mapBounds.extend(result.marker.position);
                            map.fitBounds(mapBounds);

                            // Calls the helper function that manage the render for the marker
                            renderMarker(result, infoWindow);
                        });
                    }


                    /**
                     * Subscribe to the array of places that receives the binding, which is the parameter that
                     * will use to initiate the map and update the list of markers
                     */
                    data.area.places.subscribe(function (rawList) {
                        if (map === undefined) {
                            map = new google.maps.Map(element, {
                                center: data.area.location(),
                                zoom: 10,
                                streetViewControl: false,
                                mapTypeControlOptions: {mapTypeIds: ['ROADMAP']},
                                styles: [
                                    {elementType: 'geometry', stylers: [{color: '#FCE4EC'}]},
                                    {elementType: 'labels.text.stroke', stylers: [{color: '#FCE4EC'}]},
                                    {elementType: 'labels.text.fill', stylers: [{color: '#F48FB1'}]},
                                    {featureType: 'road', elementType: 'geometry', stylers: [{color: '#FAFAFA'}]},
                                    {featureType: 'poi', stylers: [{visibility: 'off'}]},
                                    {featureType: 'transit.station', stylers: [{visibility: 'off'}]},
                                    {featureType: 'administrative.locality', stylers: [{visibility: 'off'}]},
                                    {featureType: 'administrative.neighborhood', stylers: [{visibility: 'off'}]}
                                ]
                            });
                            mapBounds = new google.maps.LatLngBounds();
                            markerInfo = new google.maps.InfoWindow();
                        }

                        ko.utils.arrayForEach(rawList, function (result) {
                            if (result instanceof Place) {
                                markersList.removeAll();
                                ko.utils.arrayForEach(rawList, function (result) {
                                    markersList.push({
                                        marker: new google.maps.Marker({
                                            position: {lat: result.location.lat, lng: result.location.lng},
                                            visible: true,
                                            icon: 'app/img/src/markerIcon.svg',
                                            content: '<div class="venue-markerInfo">' +
                                                    '<h3 class="venue-markerInfo-title">' + result.title + '</h3>' +
                                                    '<p class="venue-markerInfo-details">' + result.activity.checkins + ' checkins</p>' +
                                                    '<p class="venue-markerInfo-details">' + result.activity.hereNow + '</p>' +
                                                    '</div>'
                                        }),
                                        status: result.checked,
                                        category: result.category
                                    });
                                });
                            }
                        });

                        /**
                         * Force the update of the filter property to happen. We need need this to make work the filter
                         * at the default state
                         */
                        data.filter.valueHasMutated();
                    });


                    /**
                     * Susbcribe to the filter property, so every time the filter changes we apply the filter feature
                     * in order to atach the markers on the map.
                     */
                    data.filter.subscribe(function (activeFilter) {
                        markersListFiltered = modelView.applyFilter(markersList(), activeFilter);
                        renderMap(markersList(), markersListFiltered, markerInfo);
                    });

                }, function (error) {
                    element.classList.add('map-error');
                    element.innerHTML = 'We found coffee places for you, but Google maps failed to load at this time';
                });
            }
        };
    }
);
