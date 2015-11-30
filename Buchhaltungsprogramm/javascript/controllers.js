var controllers = angular.module('controllers', ['ngStorage']);

controllers.controller('buchhaltungCtrl', function ($scope, $localStorage) {
    
    //initialisieren der Konti
    $scope.konten = new Kontenplan('Standart')
    
    
    $scope.konten.k_speichern(new Konto(1000, "Kasse", 0))
    $scope.konten.k_speichern(new Konto(1020, "Bankguthaben", 0))
    $scope.konten.k_speichern(new Konto(1530, "Fahrzeuge", 0))
    $scope.konten.k_speichern(new Konto(2000, "Kreditoren", 0))
    $scope.konten.k_speichern(new Konto(2800, "Eigenkapital", 0))
    
    
    //initialisieren des Speichers
    /*NUR PROVISORISCH*/
    $scope.storage = $localStorage.$default( {journalBuchhaltung: []})
    //initialisieren der hilfsvariablen
    $scope.buttonTxt = "Speichern"
    var inBearb = -1        //speichert die nr der Buchung oder des kontos in bearbeitung, -1 wenn keine in bearbeitung
    
    //initialisieren des journals
    $scope.journal = new Journal('Test', $scope.storage)
    $scope.journal.j_lesen();
    
    //reset der input-felder
    reset()
    
    /*
        Funktion für das abspeichern der Buchungen und Konti
    */
    $scope.speichern = function(typ){
        
        if(typ == 'buchung'){
            if(inBearb < 0){ //eine neue Buchung speichern

                var b = new Buchung(0, $scope.eingDatum, $scope.eingBelegnr, $scope.eingBuchungstxt, $scope.eingKontoSoll, $scope.eingKontoHaben, $scope.eingBetrag)
            
                $scope.journal.b_speichern(b)
        
                /*VERBUCHEN DES BETRAGS IN DEN KONTI*/
        
            } else { //eine Buchung bearbeiten
                var b = $scope.journal.buchungFuerBuchungsnr(inBearb)
            
                b.datum = $scope.eingDatum
                b.belegnr = $scope.eingBelegnr
                b.buchungstxt = $scope.eingBuchungstxt
                b.kontoSoll = $scope.eingKontoSoll
                b.kontoHaben = $scope.eingKontoHaben
                b.betrag = $scope.eingBetrag
            
                $scope.journal.b_ueberschreiben(b)   //eintragen der bearbeiteten buchung
            
                /* EV. VERBUCHEN DES BETRAGS IN ENTSP. KONTI*/
                /* EV. LÖSCHEN DER BUCHUNG IN ENTSP. KONTI*/
            }
        } else {
            if(inBearb < 0){ //ein neues Konto speichern
                var k = new Konto($scope.eingKontonr, $scope.eingKontoname, $scope.eingEroeffnungssaldo)
            
                $scope.konten.k_speichern(k)
            } else { //ein Konto bearbeiten
                var k = $scope.konten.kVonKnr(inBearb)
                
                k.nr = $scope.eingKontonr
                k.name = $scope.eingKontoname
                k.eroeffnungssaldo = $scope.eingEroeffnungssaldo
                
                $scope.konten.k_ueberschreiben(k)
            }
        }
        
        reset()
    };
    
    /*
        Funktion für das löschen einer Buchung
    */
    $scope.loeschen = function(obj, typ){
    
        typ == 'buchung' ? $scope.journal.b_loeschen(obj) : $scope.konten.k_loeschen(obj)
    };
    
    /*
        Funktion für das bearbeiten einer Buchung
    */
    $scope.bearbeiten = function(obj, typ){
        if($scope.buttonTxt == "Speichern"){
            if(typ == 'buchung'){
                $scope.eingDatum = obj.datum
                $scope.eingBelegnr = obj.belegnr
                $scope.eingBuchungstxt = obj.buchungstxt
                $scope.eingKontoSoll = obj.kontoSoll
                $scope.eingKontoHaben = obj.kontoHaben
                $scope.eingBetrag = obj.betrag
            } else {
                $scope.eingKontonr = obj.nr
                $scope.eingKontoname = obj.name
                $scope.eingEroeffnungssaldo = obj.eroeffnungssaldo
            }
            
            inBearb = obj.nr
            $scope.buttonTxt = "Fertig"
        }
    };
    
    /*
        Funktion die die Daten einer Buchung in die Maske kopiert
    */
    $scope.kopieren = function(obj, typ){
        if(typ == 'buchung'){
            $scope.eingDatum = obj.datum
            $scope.eingBelegnr = obj.belegnr
            $scope.eingBuchungstxt = obj.buchungstxt
            $scope.eingKontoSoll = obj.kontoSoll
            $scope.eingKontoHaben = obj.kontoHaben
            $scope.eingBetrag = obj.betrag
        } else {
            $scope.eingKontonr = obj.nr
            $scope.eingKontoname = obj.name
            $scope.eingEroeffnungssaldo = obj.eroeffnungssaldo
        }
    };
    
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
        
        $scope.eingKontonr = ""
        $scope.eingKontoname = ""
        $scope.eingEroeffnungssaldo = 0
        
        $scope.buttonTxt = "Speichern"
        inBearb = -1
    }
    
});