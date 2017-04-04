requirejs.config({
    paths: {
        jQuery: '../node_modules/jquery/dist/jquery.min',
        text: '../node_modules/text/text',
        async: '../node_modules/requirejs-plugins/src/async',
        knockout: '../node_modules/knockout/build/output/knockout-latest',
        appConfig: 'data',
        viewModel: 'viewModel',
        area: 'models/area',
        place: 'models/place',
        navigation: 'components/navigation/navigation',
        searchBox: 'components/searchBox/searchBox',
        section: 'components/section/section',
        searchResults: 'components/searchResults/searchResults',
        mapView: 'components/searchResults/mapView',
        gmaps: 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCPsY1UJDlPNj9KMLsMX9Bnb706B4RwF-4'
    },
    shim: {
        'jQuery': {
            deps: [],
            exports: 'jQuery'
        }
    }
});

require(['knockout', 'viewModel'], function (ko, viewModel) {
    ko.applyBindings(viewModel);
});
