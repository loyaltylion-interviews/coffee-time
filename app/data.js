define(
    [
        "knockout"
    ],
    function (ko) {
        var appConfig = {
            name: "Coffee Time",
            domain: "http://127.0.0.1:8000/",
            keys: {
                fq: "YOUR_FOURSQUARE_CLIENT_ID",
                googleGeo: 'YOUR_GOOGLEGEO_KEY'
            }
        };

        appConfig.fq_token = ko.computed(function () {
            if (window.location.href.indexOf("#access_token=") !== -1) {
                window.localStorage.setItem("fq_token", window.location.href.split("#access_token=")[1]);
            }
            return window.localStorage.getItem("fq_token");
        })

        return appConfig;
    }
);
