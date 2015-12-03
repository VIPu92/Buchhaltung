var kassenbuchApp = angular.module('buchhaltungApp', [
    'ngRoute',
    'controllers'
]);


kassenbuchApp.config(['$routeProvider',
    function($routeProvider){
        $routeProvider.
            when('/journal', {
                templateUrl: 'partials/journal.html',
                controller: 'buchhaltungCtrl'
            }).
            when('/konten', {
                templateUrl: 'partials/kontenplan.html',
                controller: 'buchhaltungCtrl'
            }).
            when('/kontenblatt', {
                templateUrl: 'partials/kontenblatt.html',
                controller: 'buchhaltungCtrl'
            }).
            when('/bilanzErfolg', {
                templateUrl: 'partials/bilanz_erfolgsrechnung.html',
                controller: 'buchhaltungCtrl'
            }).
            otherwise({
                redirectTo: '/journal',
                controller: 'buchhaltungCtrl'
            });
}]);