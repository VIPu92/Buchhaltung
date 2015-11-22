var controllers = angular.module('controllers', ['ngStorage']);

controllers.controller('buchhaltungCtrl', function ($scope, $localStorage) {
    
    //initialisieren der Konti
    $scope.konten = [
        new Konto(1000, "Kasse", 0),
        new Konto(1020, "Bankguthaben", 0),
        new Konto(1530, "Fahrzeuge", 0),
        new Konto(2000, "Kreditoren", 0),
        new Konto(2800, "Eigenkapital", 0)
    ];
    
    //initialisieren des journals
    $scope.storage = $localStorage.$default( {journal: []})
    //initialisieren der hilfsvariablen
    var autoBuchungsnr = 0
    $scope.buttonTxt = "Speichern"
    var buchInBearb = -1        //speichert die nr der Buchung in bearbeitung, -1 wenn keine in bearbeitung
    
    //lesen des localstorages
    $scope.journal = init()
    
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
            var b = new Buchung(autoBuchungsnr, $scope.eingDatum, $scope.eingBelegnr, $scope.eingBuchungstxt, $scope.eingKontoSoll, $scope.eingKontoHaben, $scope.eingBetrag)
        
            $scope.journal.push(b)
        
            /*VERBUCHEN DES BETRAGS IN DEN KONTI*/
        
        } else { //eine Buchung bearbeiten
            var b = $scope.journal[buchInBearb-1]
            
            b.datum = $scope.eingDatum
            b.belegnr = $scope.eingBelegnr
            b.buchungstxt = $scope.eingBuchungstxt
            b.kontoSoll = $scope.eingKontoSoll
            b.kontoHaben = $scope.eingKontoHaben
            b.betrag = $scope.eingBetrag
            
            $scope.journal[buchInBearb-1] = b   //eintragen der bearbeiteten buchung
            
            /* EV. VERBUCHEN DES BETRAGS IN ENTSP. KONTI*/
            /* EV. LÖSCHEN DER BUCHUNG IN ENTSP. KONTI*/
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
        
         /*LÖSCHEN DER BUCHUNG IN DEN ENTSP. KONTEN*/
        
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
            $scope.eingKontoSoll = buchung.kontoSoll
            $scope.eingKontoHaben = buchung.kontoHaben
            $scope.eingBetrag = buchung.betrag
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
        $scope.eingKontoSoll = buchung.kontoSoll
        $scope.eingKontoHaben = buchung.kontoHaben
        $scope.eingBetrag = buchung.betrag
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
        $scope.eingKontoSoll = 0
        $scope.eingKontoHaben = 0
        $scope.eingBetrag = 0
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
    
});