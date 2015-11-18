var controllers = angular.module('controllers', ['ngStorage']);

controllers.controller('buchhaltungCtrl', function ($scope, $localStorage) {
    
    //initialisieren der Kasse und des journals
    $scope.storage = $localStorage.$default( {journal: []})
    $scope.kasse = new Konto('Kasse', 0)
    //initialisieren der hilfsvariablen
    var autoBuchungsnr = 0
    var saldoHist = []         //array das die saldo history verfolgt
    $scope.buttonTxt = "Speichern"
    var buchInBearb = -1        //speichert die nr der Buchung in bearbeitung, -1 wenn keine in bearbeitung
    
    //lesen des localstorages
    $scope.journal = init()
    //initialisieren der Kasse anhand des journals
    akktuKasse()
    
    //akktualisieren der Buchungsnummer
    autoBuchungsnr = $scope.journal.length
    
    //reset der input-felder
    reset()
    
    /*
        Funktion für das abspeichern der Buchungen
    */
    $scope.speichern = function(){
        
        if(buchInBearb < 0){ //eine neue Buchung speichern
            autoBuchungsnr++
            var b = new Buchung(autoBuchungsnr, $scope.eingDatum, $scope.eingBelegnr, $scope.eingBuchungstxt, $scope.eingEinnahme, $scope.eingAusgabe)
        
            $scope.journal.push(b)
        
            $scope.kasse.saldo += parseFloat($scope.eingEinnahme) //muss explizit als zahl deklariert werden, da als text eingelesen wird
            $scope.kasse.saldo -= parseFloat($scope.eingAusgabe)
        
            saldoHist.push($scope.kasse.saldo)
        } else { //eine Buchung bearbeiten
            var b = $scope.journal[buchInBearb-1]
            var ein = b.ein
            var aus = b.aus
            
            b.datum = $scope.eingDatum
            b.belegnr = $scope.eingBelegnr
            b.buchungstxt = $scope.eingBuchungstxt
            b.ein = $scope.eingEinnahme
            b.aus = $scope.eingAusgabe
            
            $scope.journal[buchInBearb-1] = b   //eintragen der bearbeiteten buchung
            
            if(ein!=b.ein || aus!=b.aus) {akktuKasse()} //Kasse nur akktualisieren wenn sich die Einnahme oder Ausgabe ändert
        }
        
        
        //abspeichern des akktualisierten journals
        speichJournal()
        
        reset()
    };
    
    /*
        Funktion für das löschen einer Buchung
    */
    $scope.loeschen = function(buchung){
    
        var index = buchung.nr - 1      //index ist die position der zu löschenden buchung im journal
        
        //aufspalten des journals in eine teil der nicht ändert und einen teil der ändert (vor und nach der zu löschenden buchung)
        var bleibt = $scope.journal.slice(0, index)
        var aendert = index>=($scope.journal.length-1) ? [] : $scope.journal.slice(index+1)
        
        //korrigierten der Buchungsnummern der Buchungen nach der gelöschten Buchung
        aendert.forEach(function(b){
            b.nr -= 1
        });
        
        //wieder zusammenfügen der teilarrays zum neuen journal
        $scope.journal = bleibt.concat(aendert)
        
        //dekrementieren der automatischen buchungsnummer
        autoBuchungsnr--;
        
        //korrigieren des Kassensaldos
        akktuKasse()
        
        //speichern des neuen journals
        speichJournal()
    };
    
    /*
        Funktion für das bearbeiten einer Buchung
    */
    $scope.bearbeiten = function(buchung){
        if($scope.buttonTxt == "Speichern"){
            $scope.eingDatum = buchung.datum
            $scope.eingBelegnr = buchung.belegnr
            $scope.eingBuchungstxt = buchung.buchungstxt
            $scope.eingEinnahme = buchung.ein
            $scope.eingAusgabe = buchung.aus
            $scope.buttonTxt = "Fertig"
            buchInBearb = buchung.nr
        }
    };
    
    /*
        Funktion die die Daten einer Buchung in die Maske kopiert
    */
    $scope.kopieren = function(buchung){
        $scope.eingDatum = buchung.datum
        $scope.eingBelegnr = buchung.belegnr
        $scope.eingBuchungstxt = buchung.buchungstxt
        $scope.eingEinnahme = buchung.ein
        $scope.eingAusgabe = buchung.aus
    };
    
    /*
        Funktion für die Rückgabe des saldos der kasse nach einer gegebenen Buchung
    */
    $scope.getSaldo = function(aktBuchung){
        
        return saldoHist[aktBuchung.nr-1]
    };
    
    /*
        Funktion die das Journal in den localstorage speichert
    */
    function speichJournal(){
        $scope.storage.journal = $scope.journal
    }
    
    /*
        Funktion für das löschen der input-felder
    */
    function reset(){
        $scope.eingDatum = "tt.mm.jjjj"
        $scope.eingBelegnr = ""
        $scope.eingBuchungstxt = ""
        $scope.eingEinnahme = 0
        $scope.eingAusgabe = 0
        $scope.buttonTxt = "Speichern"
        buchInBearb = -1
    }
    
    /*
        Funktion für das lesen des localstorages zu beginn
    */
    function init(){
        
        var journal = $scope.storage.journal
        
        return journal
    }
    
    /*
        Funktion für das nachrechnen des Kassensaldos nach änderungen im journal
    */
    function akktuKasse(){
        
        saldoHist = []
        $scope.kasse.saldo = 0
        
        for(var i=0;i<$scope.journal.length; i++){
            $scope.kasse.saldo += parseFloat($scope.journal[i].ein)
            $scope.kasse.saldo -= parseFloat($scope.journal[i].aus)
            
            saldoHist.push($scope.kasse.saldo)
        }
    }
    
});