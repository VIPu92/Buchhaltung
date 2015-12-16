var controllers = angular.module('controllers', ['ngStorage']);

controllers.controller('buchhaltungCtrl', function ($scope, $localStorage) {
    
    /*var standartKonten = [  new Konto(1000, "Kasse", 40),
                            new Konto(1020, "Bankguthaben", 0),
                            new Konto(1530, "Fahrzeuge", 0),
                            new Konto(2000, "Kreditoren", 0),
                            new Konto(2800, "Eigenkapital", 0),
                            new Konto(3200, "Handelserlöse", 0),
                            new Konto(3400, "Dienstleistungserlöse", 0),
                            new Konto(4400, "Aufwand für Dienstleistungen", 0),
                            new Konto(5900, "Leistungen Dritter", 0)
    ];*/
    
    //initialisieren des Speichers
    /*NUR PROVISORISCH*/
    //var storage = $localStorage.$default( {journal_test: [], kontenplan_test: []/*standartKonten*/})
    var storage = $localStorage.$default({buchhaltungen: ['test']})
    
    //initialisieren der Buchhaltung
    init()
    
    //initialisieren der hilfsvariablen
    $scope.buttonTxt = "Speichern"
    $scope.input = {}
    $scope.kontenblatt = []
    var inBearb = -1        //speichert die nr der Buchung oder des kontos in bearbeitung, -1 wenn keine in bearbeitung
    $scope.bilanzGewinnVerlust = 0
    $scope.erfolgGewinnVerlust = 0
    
    $scope.csv = {
        content: null,
        header: true,
        headerVisible: true,
        separator: ',',
        separatorVisible: true,
        encoding: 'ISO-8859-1',
        encodingVisible: true,
        result: null
    };
   
    //reset der input-felder
    reset()
    
    
    /*
        Funktion für das abspeichern der Buchungen und Konti
    */
    $scope.speichern = function(typ){
        
        if(inBearb < 0){ //eine neue Buchung oder ein neues konto speichern

            $scope.buch.hinzuVonInput(typ, $scope.input)
        
        } else {
            $scope.buch.aendern(typ, inBearb, $scope.input)
        } 
        
        reset()
    };
    
    /*
        Funktion für das löschen einer Buchung
    */
    $scope.loeschen = function(typ, obj){
        
        $scope.buch.loeschen(typ, obj)
    };
    
    /*
        Funktion für das bearbeiten einer Buchung oder Kontos
    */
    $scope.bearbeiten = function(obj){
        if($scope.buttonTxt == "Speichern"){
            $scope.input = $scope.buch.objFuerInput(obj)
            
            inBearb = obj.nr
            $scope.buttonTxt = "Fertig"
        }
    };
    
    /*
        Funktion die die Daten einer Buchung oder eines Kontos in die Maske kopiert
    */
    $scope.kopieren = function(obj){
        $scope.input = $scope.buch.objFuerInput(obj)
    };
    
    /*
        Funktion zum anzeigen eines Kontenblatts
    */
    $scope.kbAnzeigen = function(kontonr){
        
        var k = $scope.buch.kontenplan.kVonKnr(kontonr)
        
        $scope.kontenblatt = k.buchungen.slice(0) //klonen des buchungen arrays
        
        var letzterSaldo = $scope.kontenblatt[$scope.kontenblatt.length-1].s
        
        $scope.kontenblatt.push({b: new Buchung(0, '', '', 'Saldo', '', '', (letzterSaldo<0?-letzterSaldo:letzterSaldo)), t:(letzterSaldo<0?"soll":"haben"), s:''})
    };
    
    
    $scope.bilanz = function(){
        $scope.bilanzGewinnVerlust = $scope.buch.kontenplan.bilanz()
    };
    
    $scope.erfolgsrechnung = function(){
        $scope.erfolgGewinnVerlust = $scope.buch.kontenplan.erfolgsrechnung()
    };
    
    
    $scope.csvExport = function(id){
        switch(id){
            case 'journal':
                return $scope.buch.journal.journal.slice(0)
            case 'kontenplan':
                return $scope.buch.kontenplan.arrayFuerExport()
            case 'kontenblatt':
                var b = $scope.buch.kontenplan.kVonKnr($scope.input.kontoAnz).buchungen
                var array = []
                for(var i=0; i<b.length; i++){
                    var e = b[i]
                    array.push({datum:e.b.datum, text:e.b.buchungstxt, soll:(e.t=='soll'?e.b.betrag:''), haben:(e.t=='haben'?e.b.betrag:''), saldo:e.s})
                }
                return array
            case 'bilanz':
                var a = $scope.buch.kontenplan.aktiva()
                var p = $scope.buch.kontenplan.passiva()
                var max = (a.length<p.length?p.length:a.length)
                var array = []
                for(var i=0;i<max;i++){
                    array.push([(i<a.length?a[i].name + ': ' + a[i].saldo:''), (i<p.length?p[i].name + ': ' + p[i].saldo:'')])
                }
                array.push([($scope.bilanzGewinnVerlust<0 ? "Verlust: "+(-$scope.bilanzGewinnVerlust) : ""), ($scope.bilanzGewinnVerlust>=0 ? "Gewinn: " + $scope.bilanzGewinnVerlust : "")])
                return array
            case 'erfolg':
                var e = $scope.buch.kontenplan.ertragskonten()
                var a = $scope.buch.kontenplan.aufwandskonten()
                var max = (e.length<a.length?a.length:e.length)
                var array = []
                for(var i=0;i<max;i++){
                    array.push([(i<e.length?e[i].name + ': ' + e[i].saldo:''), (i<a.length?a[i].name + ': ' + a[i].saldo:'')])
                }
                array.push([($scope.erfolgGewinnVerlust<0 ? "Verlust: "+(-$scope.erfolgGewinnVerlust) : ""), ($scope.erfolgGewinnVerlust>=0 ? "Gewinn: " + $scope.erfolgGewinnVerlust : "")])
                return array
                
        }
    };
    
    $scope.csvImport = function(id){
        switch(id){
            case 'journal':
                var jTemp = $scope.csv.result
                var jLen = $scope.csv.result.length
                
                for(var i=0; i<jLen; i++){
                    var tempIn = {datum: jTemp[i].Datum, belegnr:jTemp[i].Belegnummer, buchungstxt:jTemp[i].Buchungstext, kontoSoll:jTemp[i].KontoSoll, kontoHaben:jTemp[i].KontoHaben, betrag:parseInt(jTemp[i].Betrag)}
                    $scope.buch.hinzuVonInput('buchung', tempIn)
                }
                break
            case 'kontenplan':
                var kpTemp = $scope.csv.result
                var kpLen = $scope.csv.result.length
                
                for(var i=0; i<kpLen; i++){
                    var tempIn = {nr: kpTemp[i].Kontonummer, name:kpTemp[i].Kontoname, eroeffnungssaldo:parseInt(kpTemp[i].Eröffnungssaldo)}
                    $scope.buch.hinzuVonInput('konto', tempIn)
                }
                
            break
        }
    };
    
    $scope.neueBuchhaltung = function(){
        var neueB = Buchhaltung.init($scope.neueBName,storage)
        $scope.alleB.push(neueB.name)
        $scope.aktB = neueB.name
        $scope.buch = neueB
        storage.buchhaltungen = $scope.alleB
    }
    
    $scope.anzeigen = function(){
        $scope.buch = Buchhaltung.init($scope.aktB, storage)
    }
    
    function init(){
        $scope.alleB = storage.buchhaltungen
        if($scope.alleB.length !== 0){
            $scope.aktB = $scope.alleB[0]
            $scope.buch = Buchhaltung.init($scope.aktB, storage)
        } else {
            $scope.aktB = ''
            $scope.buch = null
        }
    }
    
    /*
        Funktion für das reseten der input-felder
    */
    function reset(){
        $scope.input.datum = "tt.mm.jjjj"
        $scope.input.belegnr = ""
        $scope.input.buchungstxt = ""
        $scope.input.kontoSoll = 0
        $scope.input.kontoHaben = 0
        $scope.input.betrag = 0
        
        $scope.input.nr = ""
        $scope.input.name = ""
        $scope.input.eroeffnungssaldo = 0
        
        $scope.input.kontoAnz = 0
        
        $scope.buttonTxt = "Speichern"
        inBearb = -1
    }
    
});