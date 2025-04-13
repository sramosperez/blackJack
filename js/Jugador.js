class Jugador{

    constructor(nombre,dinero){

        this.nombre=nombre;
        this.dinero=dinero; 
        this.apuesta= 0;
        this.mano= new Mano();

    }

    hacerApuesta(cantidad){
        if (cantidad > this.dinero){
            return false;
        }
        this.dinero -=cantidad;
        this.apuesta= cantidad;
        return true;
    }

    ganarApuesta(){
        this.dinero += this.apuesta*2;
        this.apuesta= 0;
    }

    perderApuesta(){
        this.apuesta=0;
    }

}