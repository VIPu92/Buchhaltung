function Buchung(buchungsnr, datum, belegnr, buchungstxt, ein, aus){
    
    this.nr = buchungsnr
    this.datum = datum
    this.buchungstxt = buchungstxt
    this.belegnr = belegnr
    this.ein = ein
    this.aus = aus
    
    Buchung.prototype.ausgabe = function(){
        
        return "Buchung "+this.id+" "+this.datum+" "+this.belegnr+" "+this.buchungstxt+" "+this.ein+" "+this.aus
    }
}



function Konto(name, startguthaben) {
    
    this.name = name
    this.saldo = startguthaben
}