define(
    [
        'knockout',
        'viewModel',
        'text!components/searchResults/searchResults.html',
        'mapView'
    ],
    function (ko, viewModel, template) {

        ko.components.register('searchResults', {
            viewModel: viewModel,
            template: template
        });
    }
);
