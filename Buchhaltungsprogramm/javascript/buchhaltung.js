/*Klassen für die Buchhaltung*/

function Buchhaltung(name, speicherort){
    
    this.name = name
    this.journal = null
    this.kontenplan = null
    this.speicherort = speicherort
    
    
    
    Buchhaltung.prototype.speichern = function(speicherort){
        /*Speichern der Daten in den Localstorage*/
        this.journal.j_speichern();
        this.kontenplan.kp_speichern();
    };
    
    Buchhaltung.prototype.lesen = function(speicherort){
        /*Einlesen der Daten aus dem Localstorage*/
        this.journal = Journal.init('journal_'+this.name, this.speicherort)
        this.kontenplan = Kontenplan.init('kontenplan_'+this.name, this.speicherort)
    };
    
    
    Buchhaltung.prototype.hinzuVonInput = function(typ, input){
        if(typ=='buchung'){
            var b = Buchung.newVonInput(input)
            this.journal.b_speichern(b)
            
            /*VERBUCHEN DES BETRAGS IN DEN KONTI*/
            this.kontenplan.kVonKnr(b.kontoSoll).b_hinzu(b)
            this.kontenplan.kVonKnr(b.kontoHaben).b_hinzu(b)
        }
        else{
            var k = Konto.newVonInput(input)
            this.kontenplan.k_speichern(k)
        }
    };
    
    Buchhaltung.prototype.loeschen = function(typ, obj){
        if(typ == 'buchung'){
            this.journal.b_loeschen(obj)
            this.kontenplan.kVonKnr(obj.kontoSoll).b_entf(obj)
            this.kontenplan.kVonKnr(obj.kontoHaben).b_entf(obj)
        } else {
            this.kontenplan.k_loeschen(obj)
        }
    };
    
    Buchhaltung.prototype.aendern = function(typ, nrInBearb, input){
        if(typ=='buchung') { 
            //eine Buchung ändern
            var b = this.journal.buchungFuerBuchungsnr(nrInBearb)
            
            /* EV. VERBUCHEN DES BETRAGS IN ENTSP. KONTI*/
            /* EV. LÖSCHEN DER BUCHUNG IN ENTSP. KONTI*/
            if(b.kontoSoll != input.kontoSoll){
                this.kontenplan.kVonKnr(b.kontoSoll).b_entf(b)
                this.kontenplan.kVonKnr(input.kontoSoll).b_hinzu(b)
            }
            
            if(b.kontoHaben != input.kontoHaben){
                this.kontenplan.kVonKnr(b.kontoHaben).b_entf(b)
                this.kontenplan.kVonKnr(input.kontoHaben).b_hinzu(b)
            }
            
            var dif = b.betrag - input.betrag
            b.ueberschreiben(input)
            
            if(dif!==0){
                this.kontenplan.kVonKnr(b.kontoSoll).aktu()
                this.kontenplan.kVonKnr(b.kontoHaben).aktu()
            }
            
            this.speichern(this.speicherort)
            
        } else { 
            //ein Konto ändern
            var k = this.kontenplan.kVonKnr(nrInBearb)
                
            k.ueberschreiben(input)
                
            this.speichern(this.speicherort)
        }
    };
    
    Buchhaltung.prototype.objFuerInput = function(obj){
        return obj.objFuerInput()
    };
}

/*Funktion zum Erstellen und Initialisieren einer Buchhaltung*/
Buchhaltung.init = function(name, speicherort){
    /*Speicher lesen, Buchungen zu Konten hinzufügen, Salden errechnen*/
    var bTemp = new Buchhaltung(name, speicherort)
    bTemp.lesen(speicherort)
    
    for(var i=0;i<bTemp.journal.journal.length; i++){
        var b = bTemp.journal.journal[i]
        bTemp.kontenplan.kVonKnr(b.kontoSoll).b_hinzu(b)
        bTemp.kontenplan.kVonKnr(b.kontoHaben).b_hinzu(b)
    }
    
    return bTemp
}; 