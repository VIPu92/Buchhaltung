var controllers = angular.module('controllers', ['ngStorage']);

controllers.controller('buchhaltungCtrl', function ($scope, $localStorage) {
    
    var standartKonten = [  new Konto(1000, "Kasse", 40),
                            new Konto(1020, "Bankguthaben", 0),
                            new Konto(1530, "Fahrzeuge", 0),
                            new Konto(2000, "Kreditoren", 0),
                            new Konto(2800, "Eigenkapital", 0),
                            new Konto(3200, "Handelserlöse", 0),
                            new Konto(3400, "Dienstleistungserlöse", 0),
                            new Konto(4400, "Aufwand für Dienstleistungen", 0),
                            new Konto(5900, "Leistungen Dritter", 0)
    ];
    
    //initialisieren des Speichers
    /*NUR PROVISORISCH*/
    $scope.storage = $localStorage.$default( {journalBuchhaltung: [], kpStandart: standartKonten})
    
    //initialisieren der hilfsvariablen
    $scope.buttonTxt = "Speichern"
    $scope.kontenblatt = []
    var inBearb = -1        //speichert die nr der Buchung oder des kontos in bearbeitung, -1 wenn keine in bearbeitung
    $scope.bilanzGewinnVerlust = 0
    $scope.erfolgGewinnVerlust = 0
    
    //initialisieren des journals
    $scope.journal = new Journal('Test', $scope.storage)
    $scope.journal.j_lesen()
    
    //initialisieren der Konti
    $scope.konten = new Kontenplan('Standart', $scope.storage)
    $scope.konten.kp_lesen()
   
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
                $scope.konten.aktuSaldo($scope.eingKontoSoll, $scope.eingBetrag)
                $scope.konten.aktuSaldo($scope.eingKontoHaben, -$scope.eingBetrag)
        
            } else { //eine Buchung ändern
                var b = $scope.journal.buchungFuerBuchungsnr(inBearb)
            
                b.datum = $scope.eingDatum
                b.belegnr = $scope.eingBelegnr
                b.buchungstxt = $scope.eingBuchungstxt
                
                /* EV. VERBUCHEN DES BETRAGS IN ENTSP. KONTI*/
                /* EV. LÖSCHEN DER BUCHUNG IN ENTSP. KONTI*/
                if(b.kontoSoll != $scope.eingKontoSoll){
                    $scope.konten.aktuSaldo(b.kontoSoll, -b.betrag)
                    $scope.konten.aktuSaldo($scope.eingKontoSoll, b.betrag)
                    b.kontoSoll = $scope.eingKontoSoll
                }
                
                if(b.kontoHaben != $scope.eingKontoHaben){
                    $scope.konten.aktuSaldo(b.kontoHaben, b.betrag)
                    $scope.konten.aktuSaldo($scope.eingKontoHaben, -b.betrag)
                    b.kontoHaben = $scope.eingKontoHaben
                }
                
                if(b.betrag != $scope.eingBetrag){
                    var dif = b.betrag - $scope.eingBetrag
                    $scope.konten.aktuSaldo(b.kontoSoll, dif)
                    $scope.konten.aktuSaldo(b.kontoHaben, -dif)
                }
            
                $scope.journal.b_ueberschreiben(b)   //eintragen der bearbeiteten buchung
            }
        } else {
            if(inBearb < 0){ //ein neues Konto speichern
                var k = new Konto($scope.eingKontonr, $scope.eingKontoname, $scope.eingEroeffnungssaldo)
            
                $scope.konten.k_speichern(k)
            } else { //ein Konto ändern
                var k = $scope.konten.kVonKnr(inBearb)
                
                /*EV. AKKTUALISIEREN DES GANZEN JOURNALS*/
                if(k.nr != $scope.eingKontonr){
                    for(var i=0; i<$scope.journal.journal.length; i++){
                        var aktBuch = $scope.journal.journal[i]
                        if(aktBuch.kontoSoll == k.nr) {aktBuch.kontoSoll = $scope.eingKontonr}
                        if(aktBuch.kontoHaben == k.nr) {aktBuch.kontoHaben = $scope.eingKontonr}
                    }
                    $scope.journal.j_speichern()
                    k.nr = $scope.eingKontonr
                }
                
                k.name = $scope.eingKontoname
                
                if(k.eroeffnungssaldo != $scope.eingEroeffnungssaldo){
                    var dif = k.eroeffnungssaldo - $scope.eingEroeffnungssaldo
                    konten.aktuSaldo(k.nr, dif)
                    k.eroeffnungssaldo = $scope.eingEroeffnungssaldo
                }
                
                $scope.konten.k_ueberschreiben(k)
            }
        }
        
        reset()
    };
    
    /*
        Funktion für das löschen einer Buchung
    */
    $scope.loeschen = function(obj, typ){
        
        if(typ == 'buchung'){
            $scope.journal.b_loeschen(obj)
            $scope.konten.aktuSaldo(obj.kontoSoll, -obj.betrag)
            $scope.konten.aktuSaldo(obj.kontoHaben, obj.betrag)
        } else {
            $scope.konten.k_loeschen(obj)
        }
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
        Funktion zum anzeigen eines Kontenblatts
    */
    $scope.kbAnzeigen = function(kontonr){
        var k = $scope.konten.kVonKnr(kontonr)
        
        $scope.buchungen = $scope.journal.buchungenFuerKnr(kontonr)
        
        var eintrag = {b:null, t:"", s:k.eroeffnungssaldo}
        $scope.kontenblatt = [eintrag]
        
        for(var i=0; i<$scope.buchungen.length; i++){
            var buch = $scope.buchungen[i]
            if(buch.kontoSoll == kontonr){
                eintrag = {b:buch, t:"soll", s:($scope.kontenblatt[i].s + buch.betrag)}
            }
            if(buch.kontoHaben == kontonr){
                eintrag = {b:buch, t:"haben", s:($scope.kontenblatt[i].s - buch.betrag)}
            }
            
            $scope.kontenblatt.push(eintrag)
        }
        var letzterSaldo = $scope.kontenblatt[$scope.kontenblatt.length-1].s
        $scope.kontenblatt.push({b: new Buchung(0, 'Saldo', 0, '', 0, 0, (letzterSaldo<0?-letzterSaldo:letzterSaldo)), t:(letzterSaldo<0?"soll":"haben"), s:letzterSaldo})
    };
    
    
    $scope.bilanz = function(){
        $scope.bilanzGewinnVerlust = $scope.konten.bilanz()
    };
    
    $scope.erfolgsrechnung = function(){
        $scope.erfolgGewinnVerlust = $scope.konten.erfolgsrechnung()
    };
    
    
    /*
        Funktion für das reseten der input-felder
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