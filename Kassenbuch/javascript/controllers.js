var kassenbuchApp = angular.module('kassenbuchApp', ['ngStorage']);

kassenbuchApp.controller('kassenbuchCtrl', function ($scope, $localStorage) {
    
    //initialisieren der Kasse und des journals
    $scope.storage = $localStorage.$default( {journal: []})
    $scope.kasse = new Konto('Kasse', 0)
    //initialisieren der hilfsvariablen
    var autoBuchungsnr = 0
    var saldoHist = [0]         //array das die saldo history verfolgt
    
    //lesen des localstorages
    $scope.journal = init()
    //initialisieren der Kasse anhand des journals
    initKasse()
    
    //akktualisieren der Buchungsnummer
    autoBuchungsnr = $scope.journal.length
    
    //reset der input-felder
    reset()
    
    /*
        Funktion für das abspeichern der Buchungen
    */
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
    
    /*
        Funktion für das löschen der input-felder
    */
    function reset(){
        $scope.eingDatum = "tt.mm.jjjj"
        $scope.eingBelegnr = ""
        $scope.eingBuchungstxt = ""
        $scope.eingEinnahme = 0
        $scope.eingAusgabe = 0
    }
    
    /*
        Funktion für das lesen des localstorages zu beginn
    */
    function init(){
        
        var journal = $scope.storage.journal
        
        return journal
    }
    
    /*
        Funktion für das akktualisieren der Kasse nach dem lesen des Journals
        aus dem localstorage
    */
    function initKasse(){
        
        for(var i=0;i<$scope.journal.length; i++){
            $scope.kasse.saldo += parseFloat($scope.journal[i].ein)
            $scope.kasse.saldo -= parseFloat($scope.journal[i].aus)
            
            saldoHist.push($scope.kasse.saldo)
        }
    }
    
});