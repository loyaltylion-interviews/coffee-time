define(
    [
        'knockout'
    ],
    function (ko) {

        /**
         * @class
         * Creates a new venue.
         */
        function Place(data) {
            this.title = data.title;
            this.location = data.location;
            this.address = data.address;
            this.activity = data.activity;
            this.category = data.category;
            this.website = data.website;
            this.checked = ko.observable();
        }

        return Place;
    }
);
