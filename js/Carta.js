class Carta {
  constructor(valor, palo) {
    this.nombreCarta = `${this.nombreFigura(valor)} de ${palo}`;
    //si el valor es 1 (As) le ponemos 11 y si es mayor que 10 le asigno 10 (figuras)
    this.valor = valor === 1 ? 11 : valor > 10 ? 10 : valor;
  }

  //metodo para obtener el nombre de la carta si es una figura
  nombreFigura(valor) {
    let nombreFig = { 1: "As", 11: "Jota", 12: "Reina", 13: "Rey" };
    return nombreFig[valor] || valor;
  }

  palo() {
    return this.nombreCarta.split(" ").pop(); //extraigo la ultima palabra de nombreCarta
  }

  getValor() {
    return this.valor;
  }

  toString() {
    return this.nombreCarta;
  }
}
