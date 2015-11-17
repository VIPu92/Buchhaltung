var kassenbuchApp = angular.module('kassenbuchApp', ['ngStorage']);

kassenbuchApp.controller('kassenbuchCtrl', function ($scope, $localStorage) {
    
    $scope.storage = $localStorage.$default( {journal: []})
    
    $scope.journal = init()
    
    var autoBuchungsnr = 0
    $scope.kasse = new Konto('Kasse', 0)
    var saldoHist = [0] //array das die saldo history verfolgt, gebastelte lösung für die saldo anzeige
    reset()
    
    $scope.speichern = function(){
        
        autoBuchungsnr++
        var b = new Buchung(autoBuchungsnr, $scope.eingDatum, $scope.eingBelegnr, $scope.eingBuchungstxt, $scope.eingEinnahme, $scope.eingAusgabe)
        
        $scope.journal.push(b)
        
        $scope.kasse.saldo += parseFloat($scope.eingEinnahme) //muss explizit als zahl deklariert werden, da als text eingelesen wird
        $scope.kasse.saldo -= parseFloat($scope.eingAusgabe)
        
        saldoHist.push($scope.kasse.saldo)
        
        $scope.storage.journal = $scope.journal
        
        reset()
    };
    
    $scope.getSaldo = function(aktBuchung){
        
        return saldoHist[aktBuchung.nr]
    };
    
    
    function reset(){
        $scope.eingDatum = "tt.mm.jjjj"
        $scope.eingBelegnr = ""
        $scope.eingBuchungstxt = ""
        $scope.eingEinnahme = 0
        $scope.eingAusgabe = 0
    }
    
    function init(){
        
        var journal = $scope.storage.journal
        
        return journal
    }
    
});