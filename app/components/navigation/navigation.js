define(
    [
        'knockout',
        'viewModel',
        'text!components/navigation/navigation.html',
        'jQuery'
    ],
    function (ko, viewModel, template) {

        ko.components.register('navigation', {
            viewModel: viewModel,
            template: template
        });
    }
);
