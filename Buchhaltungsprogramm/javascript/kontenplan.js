function Kontenplan(name, speicherort){
    
    this.speicherort = speicherort
    this.name = name
    this.konten = []
    
    
    
    Kontenplan.prototype.kp_speichern = function(){
        /*NUR PROVISORISCH*/
        var kontenLeicht = []
        for(var i=0;i<this.konten.length; i++){
            kontenLeicht.push(this.konten[i].speicherKonto())
        }
        this.speicherort[this.name] = kontenLeicht
    };
    
    Kontenplan.prototype.kp_lesen = function(){
        /*NUR PROVISORISCH*/
        var kpTemp = this.speicherort[this.name]
        
        if(kpTemp===undefined) kpTemp = []
        
        for(var i=0;i<kpTemp.length; i++){
            var k = kpTemp[i]
            var newK = new Konto(k.nr, k.name, k.eroeffnungssaldo)
            newK.eroeffnung()
            this.konten.push(newK)
        }
    };
    
    
    
    Kontenplan.prototype.saldoVonKnr = function(knr){
        return this.kVonKnr(knr).saldo
    };
    
    
    Kontenplan.prototype.k_speichern = function (k){
        this.konten.push(k)
        
        this.konten.sort(function(k1,k2){return k1.nr-k2.nr;})
        
        this.kp_speichern()
    };
    
    Kontenplan.prototype.k_ueberschreiben = function(k){
        var i = this.indexVonK(k)
        
        this.konten[i] = k
        
        this.konten.sort(function(k1,k2){return k1.nr-k2.nr;})
        
        this.kp_speichern()
    };
    
    Kontenplan.prototype.k_loeschen = function(k){
        var i = this.indexVonK(k)
        
        //aufspalten der konten in einen teil vor und nach dem zu löschenden konto
        var vor = this.konten.slice(0, i)
        var nach = i>=(this.konten.length-1) ? [] : this.konten.slice(i+1)
        
        //wieder zusammenfügen der teilarrays zum neuen kontoarray
        this.konten = vor.concat(nach)
        
        this.kp_speichern()
    };
    
    Kontenplan.prototype.arrayFuerExport = function(){
        var array = []
        for(var i=0; i<this.konten.length; i++){
            array.push(this.konten[i].objFuerExport())
        }
        return array
    };
    
    
    /* Funktionen die die Filterung nach Schweizer Kontenramen KMU übernehmen. */
    Kontenplan.prototype.aktiva = function(){
        return this.konten.filter(function(k){return k.nr>=1000 && k.nr<2000;})
    };
    
    Kontenplan.prototype.passiva = function(){
        return this.konten.filter(function(k){return k.nr>=2000 && k.nr<3000;})
    };
    
    Kontenplan.prototype.ertragskonten = function(){
        return this.konten.filter(function(k){return ((k.nr>=3000 && k.nr<4000) || (k.nr>=6950 && k.nr<7010) || (k.nr>=7500 && k.nr<7510) || (k.nr>=8100 && k.nr<8200) || (k.nr>=8510 && k.nr<8600));})
    };
        
    Kontenplan.prototype.aufwandskonten = function(){
        return this.konten.filter(function(k){return ((k.nr>=4000 && k.nr<6950) || (k.nr>=7010 && k.nr<7020) || (k.nr>=7510 && k.nr<7520) || (k.nr>=8000 && k.nr<8100) || (k.nr>=8500 && k.nr<8510) || (k.nr>=8900 && k.nr<9000));})
    };
    
    Kontenplan.prototype.abschlusskonten = function(){
        return this.konten.filter(function(k){return k.nr>=9000 && k.nr<=9999})
    };
    
    
    Kontenplan.prototype.bilanz = function(){
        var akt = this.aktiva()
        var pas = this.passiva()
        
        var totAkt = 0
        var totPas = 0
        
        for(var i=0; i<akt.length; i++){
            totAkt += akt[i].saldo
        }
        
        for(var i=0; i<pas.length; i++){
            totPas += pas[i].saldo             
        }
        
        return totAkt + totPas
    };
    
    Kontenplan.prototype.erfolgsrechnung = function(){
        var ert = this.ertragskonten()
        var auf = this.aufwandskonten()
        
        var totErt = 0
        var totAuf = 0
        
        for(var i=0; i<ert.length; i++){
            totErt += ert[i].saldo
        }
        
        for(var i=0; i<auf.length; i++){
            totAuf += auf[i].saldo          
        }
        
        return totErt + totAuf
    };
    
    
    Kontenplan.prototype.kVonKnr = function(knr){
        for(var i = 0; i < this.konten.length; i++){
            if(knr == this.konten[i].nr) {
                return this.konten[i]
            }
        }
    };
    
    Kontenplan.prototype.indexVonK = function(k){
        var i = 0
        
        while(i<this.konten.length && this.konten[i].nr!=k.nr) {i++;}
        
        return i;
    };

}



Kontenplan.init = function(name, speicherort){
    var kpTemp = new Kontenplan(name, speicherort)
    kpTemp.kp_lesen()
    
    return kpTemp
};