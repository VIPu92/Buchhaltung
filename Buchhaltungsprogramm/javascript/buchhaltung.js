function Buchung(buchungsnr, datum, belegnr, buchungstxt, kontoSoll, kontoHaben, betrag){
    
    this.nr = buchungsnr
    this.datum = datum
    this.buchungstxt = buchungstxt
    this.belegnr = belegnr
    this.kontoSoll = kontoSoll
    this.kontoHaben = kontoHaben
    this.betrag = betrag
    
    Buchung.prototype.ausgabe = function(){
        
        return "Buchung "+this.id+", "+this.datum+", Beleg "+this.belegnr+", "+this.buchungstxt+", von "+this.kontoSoll+" nach "+this.kontoHaben+", CHF "+this.betrag
    }
}



function Konto(nr, name, startguthaben) {
    
    this.nr = nr
    this.name = name
    this.eroeffnungssaldo = startguthaben
}