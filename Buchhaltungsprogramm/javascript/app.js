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
                templateUrl: 'partials/kontenblatt.html',
                controller: 'buchhaltungCtrl'
            }).
            otherwise({
                redirectTo: '/journal',
                controller: 'buchhaltungCtrl'
            });
}]);