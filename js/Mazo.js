class Mazo {
  constructor() {
    this.cartas = [];

    const palo = ["Picas", "Treboles", "Diamantes", "Corazones"];
    const valor = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

    for (let i = 0; i < palo.length; i++) {
      for (let j = 0; j < valor.length; j++) {
        let carta = new Carta(valor[j], palo[i]);
        this.cartas.push(carta);
      }
    }

    this.numeroCartas = this.cartas.length;
  }

  //funcion que desordena las barajas
  baraja() {
    for (let i = this.cartas.length - 1; i > 0; i--) {
      //recorre el mazo de atras hacia adelante
      const j = Math.floor(Math.random() * (i + 1)); //genera un indice aleatorio y es con la que se intercambiara la carta de atrás
      [this.cartas[i], this.cartas[j]] = [this.cartas[j], this.cartas[i]];
    }
  }

  numeroCartas() {
    return this.numeroCartas;
  }

  //sacar una carta y actualiza numeroCartas
  daCarta() {
    let carta = this.cartas.pop();
    this.numeroCartas = this.cartas.length;
    return carta;
  }

  //metodo creado para depurar
  mostrarMazo() {
    this.cartas.forEach((carta) => console.log(carta.toString()));
  }
}
