define(
    [
        'knockout',
        'viewModel',
        'text!components/section/section.html'
    ],
    function (ko, viewModel, template) {

        ko.components.register('section', {
            viewModel: viewModel,
            template: template
        });
    }
);
