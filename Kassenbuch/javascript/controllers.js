var kassenbuchApp = angular.module('kassenbuchApp', []);

kassenbuchApp.controller('kassenbuchCtrl', function ($scope) {
    
    $scope.journal = [ 
        new Buchung(1, '1.1.15', 1, "Eroeffnung", 1000, 0),
        new Buchung(2, '2.1.15', 2, "starbucks", 0, 3.50),
        new Buchung(3, '3.1.15', 3, "neues natel", 0, 689),
        new Buchung(4, '5.1.15', 4, "Verkauf altes natel", 100, 0)
    ];
    
    $scope.kasse = new Konto('Kasse', 0)
    $scope.kasse.saldo += $scope.journal[0].ein
    $scope.kasse.saldo -= $scope.journal[1].aus
    $scope.kasse.saldo -= $scope.journal[2].aus
    $scope.kasse.saldo += $scope.journal[3].ein
    
});