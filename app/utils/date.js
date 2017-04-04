define(
    [
        'knockout'
    ],
    function (ko) {
        function todayDate() {
        // Helper function to determine the current date.
            var date = new Date();
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var day = date.getDate();
            var today;

            if (day < 10) {
                day = '0' + day;
            }
            if (month < 10) {
                month = '0' + month;
            }
            today = year + month + day;
            return today;
        }
        return todayDate();
    }
);
