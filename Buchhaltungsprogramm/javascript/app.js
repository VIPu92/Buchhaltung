var kassenbuchApp = angular.module('buchhaltungApp', [
    'ngRoute',
    'controllers',
    'ngSanitize',
    'ngCsv'
]);


kassenbuchApp.config(['$routeProvider',
    function($routeProvider){
        $routeProvider.
            when('/journal', {
                templateUrl: 'partials/journal.html'
            }).
            when('/konten', {
                templateUrl: 'partials/kontenplan.html'
            }).
            when('/kontenblatt', {
                templateUrl: 'partials/kontenblatt.html'
            }).
            when('/bilanzErfolg', {
                templateUrl: 'partials/bilanz_erfolgsrechnung.html'
            }).
            otherwise({
                redirectTo: '/journal'
            });
}]);