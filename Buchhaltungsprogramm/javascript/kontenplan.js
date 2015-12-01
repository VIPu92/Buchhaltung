function Kontenplan(name, storage){
    
    this.storage = storage
    this.name = name
    this.konten = []
    
    
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
    
    
    Kontenplan.prototype.aktiva = function(){
        return this.konten.filter(function(k){return k.nr>=1000 && k.nr<2000;})
    };
    
    Kontenplan.prototype.passiva = function(){
        return this.konten.filter(function(k){return k.nr>=2000 && k.nr<3000;})
    };
    
    Kontenplan.prototype.ertragskonten = function(){
        return this.konten.filter(function(k){return k.nr>=3000 && k.nr<4000;})
    };
        
    Kontenplan.prototype.aufwandskonten = function(){
        return this.konten.filter(function(k){return k.nr>=4000 && k.nr<5000;})
    };
    
    
    Kontenplan.prototype.kp_speichern = function(){
        /*NUR PROVISORISCH*/
        this.storage.kpStandart = this.konten
    };
    
    Kontenplan.prototype.kp_lesen = function(){
        /*NUR PROVISORISCH*/
        this.konten = this.storage.kpStandart
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