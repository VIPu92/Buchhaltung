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