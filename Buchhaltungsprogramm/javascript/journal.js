function Journal(name, speicherort){
    this.name = name
    this.speicherort = speicherort
    this.journal = []
    this.autoBuchungsnr = 0
    
    
    Journal.prototype.j_speichern = function(){
        /*NUR PROVISORISCH*/
        this.speicherort[this.name] = this.journal
    };
    
    Journal.prototype.j_lesen = function(){
        /*NUR PROVISORISCH*/
        var jTemp = this.speicherort[this.name]
        
        if(jTemp === undefined) jTemp = []
        
        for(var i=0; i<jTemp.length; i++){
            var b = jTemp[i]
            this.journal.push(new Buchung(b.nr, b.datum, b.belegnr, b.buchungstxt, b.kontoSoll, b.kontoHaben, b.betrag))
        }
        
        this.autoBuchungsnr = this.journal.length
    };
    
    
    
    
    
    Journal.prototype.b_speichern = function(b){
        this.autoBuchungsnr++
        b.nr = this.autoBuchungsnr
        
        this.journal.push(b)
        
        this.j_speichern()
    };
    
    Journal.prototype.b_loeschen = function(b){
        var index = b.nr - 1      //index ist die position der zu löschenden buchung im journal
        
        //aufspalten des journals in eine teil der nicht ändert und einen teil der ändert (vor und nach der zu löschenden buchung)
        var bleibt = this.journal.slice(0, index)
        var aendert = index>=(this.journal.length-1) ? [] : this.journal.slice(index+1)
        
        //korrigierten der Buchungsnummern der Buchungen nach der gelöschten Buchung
        aendert.forEach(function(b){
            b.nr -= 1
        });
        
        //wieder zusammenfügen der teilarrays zum neuen journal
        this.journal = bleibt.concat(aendert)
        
        //dekrementieren der automatischen buchungsnummer
        this.autoBuchungsnr--;
        
        //speichern des neuen journals
        this.j_speichern()
    };
    
    
   
    
    Journal.prototype.buchungFuerBuchungsnr = function(bnr){
        return this.journal[bnr-1]
    };
    
    Journal.prototype.buchungenFuerKnr = function(knr){
        return this.journal.filter(function(b){return b.kontoSoll == knr || b.kontoHaben == knr;})
    };
}


Journal.init = function(name, speicherort){
    var jTemp = new Journal(name, speicherort)
    jTemp.j_lesen()
    
    return jTemp
};