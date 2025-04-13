class Mano{

    constructor(){
        this.numCartas;
        this.cartas=[];
    }

    descartarTodas(){
        this.cartas=[];
    }

    agnadeCarta(carta){
        this.cartas.push(carta);
    }

    getNumCartas(){
        return this.numCartas;
    }

    sumaCartas(){

        let total=0;
        let ases=0;
        this.cartas.forEach(carta => {
            total+=carta.getValor();  
            if(carta.getValor()===11){  //busca los ases 
                ases++;
            }
        });

        while (total >21 && ases > 0){  //establece si el as vale 1, si eso le resta 10 al total
            total-=10;
            ases--;
        }

        return total;
    }

}