define(
    [
        'knockout',
        'viewModel',
        'text!components/searchBox/searchBox.html'
    ],
    function (ko, viewModel, template) {
        ko.components.register('searchBox', {
            viewModel: viewModel,
            template: template
        });
    }
);
