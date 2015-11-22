function Buchung(buchungsnr, datum, belegnr, buchungstxt, betrag){
    
    this.nr = buchungsnr
    this.datum = datum
    this.buchungstxt = buchungstxt
    this.belegnr = belegnr
    this.betrag = betrag
    
    Buchung.prototype.ausgabe = function(){
        
        return "Buchung "+this.id+" "+this.datum+" "+this.belegnr+" "+this.buchungstxt+" "+this.betrag
    }
}



function Konto(name, startguthaben) {
    
    this.name = name
    this.saldo = startguthaben
}