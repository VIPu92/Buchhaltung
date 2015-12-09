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
    
    Konto.prototype.objFuerExport = function(){
        return {nr: this.nr, name: this.name, eroeffnungssaldo: this.eroeffnungssaldo, saldo: this.saldo}
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