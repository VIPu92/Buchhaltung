/*Klassen für die Buchhaltung, die Buchungen und die Konten*/

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



function Buchung(buchungsnr, datum, belegnr, buchungstxt, kontoSoll, kontoHaben, betrag){
    
    this.nr = buchungsnr
    this.datum = datum
    this.buchungstxt = buchungstxt
    this.belegnr = belegnr
    this.kontoSoll = kontoSoll
    this.kontoHaben = kontoHaben
    this.betrag = betrag
    
    
    
    Buchung.prototype.objFuerInput = function(){
        return {nr: this.nr, datum: this.datum, buchungstxt: this.buchungstxt, belegnr: this.belegnr, kontoSoll: this.kontoSoll, kontoHaben: this.kontoHaben, betrag: this.betrag}
    };
    
    Buchung.prototype.ueberschreiben = function(input){
        this.datum = input.datum
        this.buchungstxt = input.buchungstxt
        this.belegnr = input.belegnr
        this.kontoSoll = input.kontoSoll
        this.kontoHaben = input.kontoHaben
        this.betrag = input.betrag
    };
    
}

Buchung.newVonInput = function(input){
    return new Buchung(0, input.datum, input.buchungstxt, input.belegnr, input.kontoSoll, input.kontoHaben, input.betrag)
};



function Konto(nr, name, startguthaben) {
    
    this.nr = nr
    this.name = name
    this.eroeffnungssaldo = startguthaben
    this.saldo = 0
    this.buchungen = []
    
    
    Konto.prototype.eroeffnung = function(){
        this.buchungen.push({b:new Buchung(0, '', '', 'Eröffnung', this.nr, '', this.eroeffnungssaldo), t:'soll', s:this.eroeffnungssaldo})
        this.saldo = this.eroeffnungssaldo
    };
    
    
    Konto.prototype.objFuerInput = function(){
        return {nr: this.nr, name: this.name, eroeffnungssaldo: this.eroeffnungssaldo}
    };
    
    Konto.prototype.ueberschreiben = function(input){
        this.nr = input.nr
        this.name = input.name
        if(this.eroeffnungssaldo !== input.eroeffnungssaldo){
            this.eroeffnungssaldo = input.eroeffnungssaldo
            this.buchungen[0] = {b:new Buchung(0, '', '', 'Eröffnung', this.nr, '', this.eroeffnungssaldo), t:'soll', s:this.eroeffnungssaldo}
        }
        this.aktu()
    };
    
    Konto.prototype.b_hinzu = function(buchung){
        this.buchungen.push({b:buchung, t:(this.nr==buchung.kontoSoll?'soll':'haben'), s:this.saldo + (this.nr==buchung.kontoSoll?buchung.betrag:-buchung.betrag)})
        this.saldo = this.buchungen[this.buchungen.length-1].s
        
        /*EV. ORDNEN DER BUCHUNGEN NACH DATUM*/
    };
    
    Konto.prototype.b_entf = function(buchung){
        for(var i=0; i<this.buchungen.length; i++){
            if(this.buchungen[i].b.nr === buchung.nr){
                this.buchungen.splice(i,1)
            }
        }
        this.aktu()
    };
    
    Konto.prototype.aktu = function(){
        this.saldo = 0
        for(var i=0; i<this.buchungen.length; i++){
            this.buchungen[i].s = this.saldo + (this.buchungen[i].t == 'soll'?this.buchungen[i].b.betrag:-this.buchungen[i].b.betrag)
            this.saldo = this.buchungen[i].s
        }
    };
    
    Konto.prototype.speicherKonto = function(){
        return new Konto(this.nr, this.name, this.eroeffnungssaldo)
    };
}

Konto.newVonInput = function(input){
    var k = new Konto(input.nr, input.name, input.eroeffnungssaldo)
    k.eroeffnung()
    return k
};