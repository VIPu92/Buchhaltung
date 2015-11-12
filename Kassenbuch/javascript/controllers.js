var kassenbuchApp = angular.module('kassenbuchApp', []);

kassenbuchApp.controller('kassenbuchCtrl', function ($scope) {
    
    $scope.journal = [ 
        new Buchung(0, '1.1.15', 1, "Eroeffnung", 1000, 0)
    ];
    
    
    var autoBuchungsnr = 0
    $scope.kasse = new Konto('Kasse', 1000)
    var saldoHist = [1000] //array das die saldo history verfolgt, gebastelte lösung für die saldo anzeige
    reset()
    
    $scope.speichern = function(){
        
        autoBuchungsnr++
        var b = new Buchung(autoBuchungsnr, $scope.eingDatum, $scope.eingBelegnr, $scope.eingBuchungstxt, $scope.eingEinnahme, $scope.eingAusgabe)
        
        $scope.journal.push(b)
        
        $scope.kasse.saldo += parseFloat($scope.eingEinnahme) //muss explizit als zahl deklariert werden, da als text eingelesen wird
        $scope.kasse.saldo -= parseFloat($scope.eingAusgabe)
        
        saldoHist.push($scope.kasse.saldo)
        
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
    
});