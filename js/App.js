/**
 * UD6 Juego BlackJack  DEWC 2025
 * @author Sara Ramos Pérez
 */

let partida;
let juego = false;
let turno = 0;

document.addEventListener("DOMContentLoaded", () => {
  //Elementos del DOM
  let btnEmpezar = document.getElementById("empezarPartida");
  let divParticipantes = document.getElementById("participantes");
  let resultadoBots = document.getElementById("resultadoBots");
  let btnNueva = document.getElementById("nuevaMano");
  let btnPedirCarta = document.getElementById("pedirCarta");
  let btnPlantarse = document.getElementById("plantarse");
  let cartasJugador = document.getElementById("cartasJugador");
  let jugadorActivo = document.getElementById("jugadorActivo");
  let cartasCrupier = document.getElementById("cartasCrupier");
  let nombreCrupier = document.getElementById("nombreCrupier");
  let pntCrupier = document.getElementById("puntosCrupier");
  let divResultado = document.getElementById("resultado");

  //deshabilito los botones al empezar
  btnPedirCarta.disabled = true;
  btnPlantarse.disabled = true;
  btnNueva.disabled = true;

  //listeners
  btnEmpezar.addEventListener("click", crear);
  btnNueva.addEventListener("click", nuevaMano);

  function crear() {

    //si hubiera una partida anterior la borraria
    if(partida){
      limpiar();
      divParticipantes.innerHTML="";
      resultadoBots.innerHTML="";
      
  }

    setTimeout(()=> {  //retraso los prompts para poder limpiar la pantalla si fuera el caso
    //creo la partida. el mazo y mezclo las cartas
    partida = new Partida();
    partida.mazo = new Mazo();
    partida.mazo.baraja();

    let participantes, bots;

    //creo los jugadores/bots
    do {
      participantes = parseInt(prompt("Introduce el número de jugadores de la partida.(entre 4 y 7)"));
      if (isNaN(participantes) || participantes < 4 || participantes > 7) {
        alert("introduce un número valido");
      }
    } while (isNaN(participantes) || participantes < 4 || participantes > 7);

    do {
      bots = parseInt(prompt("¿Cuantos serán bot?"));
      if (isNaN(bots) || bots < 0 || bots > participantes) {
        alert("introduce un número valido.");
      }
    } while (isNaN(bots) || bots < 0 || bots > participantes);

    let humanos = participantes - bots;

    for (let i = 0; i < humanos; i++) {
      dinero = parseInt(prompt(`Dinero inicial para el jugador ${i + 1}`)); //con parseFloat me aseguro de que trata el dinero como numero y no como String
      while (isNaN(dinero) || dinero <= 0) {
        alert("Ingresa cantidad correcta, mayor que 0.");
        dinero = parseInt(prompt("¿Dinero inicial?"));
      }
      partida.jugadores.push(new Jugador(`Jugador ${i + 1}`, dinero));
    }
    for (let i = 0; i < bots; i++) {
      partida.jugadores.push(new Bot(`Bot${i + 1}`));
    }
    //añado el Crupier
    partida.jugadores.push(new Bot("Crupier"));
    //llama a la funcion que crea los divs dependiendo el numero de jugadores/humanos
    crearDivsParticipantes(partida.jugadores);
    crearDivsBots(partida.jugadores);
    btnNueva.disabled = false;
  }, 100);  //retraso de 100 milisegundos inapreciable
  
  }

  function nuevaMano() {
    if (juego) {
      //si el juego esta iniciado limpia todo
      limpiar();
    }
    //habilito los botones de pedirCarta y plantarse
    btnPedirCarta.disabled = false;
    btnPlantarse.disabled = false;

    //se realizan las apuestas de los jugadores/humanos
    partida.jugadores.forEach((jugador, index) => {
      if (jugador instanceof Jugador){
        apostar(jugador, index);
      } 
    });

    //se reparten 2 cartas a todos los jugadores y al bot
    for (let i = 0; i < partida.jugadores.length; i++) {
      partida.jugadores[i].mano.agnadeCarta(partida.mazo.daCarta());
      partida.jugadores[i].mano.agnadeCarta(partida.mazo.daCarta());
    }
    //pinto la suma de los valores de las cartas recibidas

    partida.jugadores.forEach((jugador, index) => {
      if (jugador instanceof Jugador){
        pintarPuntos(jugador, index);
      } 
    });

    manejarJuego();
  }

  function apostar(jugador, index) {
    let cantidad = parseInt(prompt(`¿Cuanto dinero apuesta el ${jugador.nombre}?`));

    while (isNaN(cantidad) || cantidad <= 0 || jugador.dinero < cantidad) {
      if (isNaN(cantidad) || cantidad <= 0) {
        alert("Introduce una cantidad válida");
      } else if (jugador.dinero < cantidad) {
        alert(`No tienes tanto dinero para apostar., Introduce una cantidad menor de ${jugador.dinero}`);
      }
      cantidad = parseInt(prompt("¿Cuanto dinero apuestas?"));
    }
    jugador.hacerApuesta(cantidad);
    pintarApuestas(jugador, index);
    actualizarBalance(jugador, index);
  }

  function manejarJuego() {


    const jugadoresHumanos = partida.jugadores.filter((jugador)=>jugador instanceof Jugador);

    if (turno > jugadoresHumanos.length - 1) {

      //logica para cuando acaban los jugadores juegan los bots

      let bots= partida.jugadores.filter((jugador)=> jugador instanceof Bot && jugador.nombre!=="Crupier");
      bots.forEach((bot, index)=>{
        while (bot.mano.sumaCartas()<17){
          bot.mano.agnadeCarta(partida.mazo.daCarta());
          //let totalPuntos = bot.mano.sumaCartas();
          
        }
        pintarPuntosBots(bot, index);
      })


      let crupier = partida.jugadores.find((bot) => bot.nombre == "Crupier");

      //logica para cuando acaben los bots que juegue el Crupier

      if (crupier) {
        pintarCartas(crupier, cartasCrupier);
        puntosCrupier(crupier);
        while (crupier.mano.sumaCartas() < 17) {
          pedirCarta(crupier, cartasCrupier, pntCrupier);
        }
        //cuando termina el crupier es cuando se comparan las cartas y se puntua
        puntuar();
      }
    } else {
      const jugador = jugadoresHumanos[turno];
      pintarCartas(jugador, cartasJugador);

      jugadorActivo.textContent = `${jugador.nombre}`;

      //habilito y deshabilito los distintos botones
      btnEmpezar.disabled = true;
      btnNueva.disabled = true;
      btnPedirCarta.disabled = false;
      btnPlantarse.disabled = false;

      btnPedirCarta.onclick = () => pedirCarta(jugador, cartasJugador, turno);
      btnPlantarse.onclick = () => plantarse(jugador, turno);
    }
  }
  //sirve para establecer una class a cada carta para poder pintarlas en el div
  function claseCarta(nombreCarta) {
    return "carta-" + nombreCarta.replace(/ de /g, "-");
  }

  function pedirCarta(jugador, divCartas, index) {
    // El método daCarta quita una carta del taco de cartas
    jugador.mano.agnadeCarta(partida.mazo.daCarta());
  
    // Verificar si el jugador es el Crupier
    if (jugador.nombre === "Crupier") {
      // No mover la carta con animación
      let totalPuntos = jugador.mano.sumaCartas();
      pintarCartas(jugador, divCartas);
      puntosCrupier(jugador);
  
      if (totalPuntos > 21) {
        btnPedirCarta.disabled = true;
        jugadorActivo.textContent = `${jugador.nombre} te has pasado`;
        

      }
    } else {
      // Mover la carta con animación
      moverCarta(() => {
        let totalPuntos = jugador.mano.sumaCartas();
        pintarCartas(jugador, divCartas);
        actualizarPuntos(jugador, index);
  
        if (totalPuntos > 21) {
          btnPedirCarta.disabled = true;
          jugadorActivo.textContent = `${jugador.nombre} te has pasado`;

          setTimeout(()=> { plantarse();}, 500);  //retrasa medio segundo el pasar turno al perder
        }
      });
    }
  }

  function plantarse() {
    btnPedirCarta.disabled = true; //deshabilito el boton de pedir Carta cuando el jugador se planta.
    btnPlantarse.disabled = true;
    //turno es quien controla la funcion de manejarJuego, aqui se incrementa para pasar al siguiente jugador.
    turno++;
    manejarJuego();
  }

  function puntuar() {
    let crupier = partida.jugadores.find((bot) => bot.nombre === "Crupier");
    let puntosCrupier = crupier.mano.sumaCartas();

    divResultado.textContent = ``;
    cartasJugador.textContent = ``;

    for (let index = 0; index < partida.jugadores.length; index++) {
      let jugador = partida.jugadores[index];

     
      if (jugador instanceof Jugador) {
        let puntosJugador = jugador.mano.sumaCartas();
        let mensaje;

        //blackJack con dos cartas
        let blackJackJugador = jugador.mano.cartas.length == 2 && puntosJugador == 21;
        let blackJackCrupier = crupier.mano.cartas.length == 2 && puntosCrupier == 21;

        //resultados
        if (blackJackJugador && !blackJackCrupier) {
          mensaje = `${jugador.nombre}: BlackJack, ganas!!`;
          jugador.ganarApuesta();
        } else if (blackJackCrupier && !blackJackJugador) {
          mensaje = "Gana la mesa por BlackJack";
        } else if (puntosJugador > 21) {
          mensaje = `${jugador.nombre}: Te has pasado de 21, pierdes`;
        } else if (puntosCrupier > 21) {
          mensaje = `${jugador.nombre}:Ganas, el bot se paso de 21.`;
          jugador.ganarApuesta();
        } else if (puntosJugador == puntosCrupier) {
          mensaje = `${jugador.nombre}:Empate`;
          jugador.dinero += jugador.apuesta;
        } else if (puntosJugador > puntosCrupier) {
          mensaje = `${jugador.nombre}:Ganas por puntos`;
          jugador.ganarApuesta();
        } else if (puntosCrupier > puntosJugador) {
          mensaje = `${jugador.nombre}:Gana la mesa`;
        }

        jugadorActivo.textContent = "";
        divResultado.innerHTML += `${mensaje}<br>`;

        actualizarBalance(jugador, index);
      }
    }

    juego = true; //juego es la variable que controla si un juego esta empezado cuando doy nuevaMano.
    btnNueva.disabled = false;
    btnEmpezar.disabled = false;
  }

  function limpiar() {
    for (let i = 0; i < partida.jugadores.length; i++) {
      partida.jugadores[i].mano.cartas = [];
    }

    turno = 0;
    limpiarDivs(partida.jugadores);
    cartasCrupier.innerHTML = "";
    pntCrupier.innerHTML = "";
    divResultado.textContent = "";
    jugadorActivo.textContent = "";
    const parrafos = resultadoBots.querySelectorAll("p");
    parrafos.forEach((parrafo) => {
    parrafo.remove();
});
  

    //tengo que crear el mazo otra vez
    partida.mazo = new Mazo();
    //mezclo las cartas
    partida.mazo.baraja();
    juego = false;
  }

  //FUNCIONES DE PINTAR

  function crearDivsParticipantes(jugadores) {
    divParticipantes.style.visibility = "visible";
    const jugadoresHumanos = jugadores.filter((jugador) => jugador instanceof Jugador);

    let contador = 1;

    jugadoresHumanos.forEach((jugador) => {
      const divJugador = document.createElement("div");
      divJugador.classList.add("participantes");
      divJugador.id = `jugador${contador}`;
      const parrNombre = document.createElement("h3");
      parrNombre.textContent = `Jugador${contador}`;
      const parrBalance = document.createElement("p");
      parrBalance.id = `balance${contador}`;
      parrBalance.textContent = `Balance: ${jugador.dinero}`;

      divJugador.appendChild(parrNombre);
      divJugador.appendChild(parrBalance);
      divParticipantes.appendChild(divJugador);

      contador++;
    });
  }

  function crearDivsBots(jugadores){

    resultadoBots.style.visibility = "visible";

    const jugadoresBots = jugadores.filter((jugador) => jugador instanceof Bot && jugador.nombre!=="Crupier");

    let contador = 1;

    jugadoresBots.forEach((jugador) => {
      const divBot = document.createElement("div");
      divBot.classList.add("resultadosBots");
      divBot.id = `bot${contador}`;
      const parrNombre = document.createElement("h3");
      parrNombre.textContent = `Bot${contador}`;
      divBot.appendChild(parrNombre);
      resultadoBots.appendChild(divBot);
      contador++;
    });
  }

  function pintarPuntosBots(bot, index) {
   
    const divBot = document.getElementById(`bot${index + 1}`);
    const parrPuntos = document.createElement("p");
    parrPuntos.id = `puntosBot${index +1}`;
    parrPuntos.textContent = `Suma cartas: ${bot.mano.sumaCartas()}`;
    divBot.appendChild(parrPuntos);

  }


  function pintarApuestas(jugador, index) {
    const divJugador = document.getElementById(`jugador${index + 1}`);
    const parrApuesta = document.createElement("p");
    parrApuesta.id = `apuesta${index + 1}`;
    parrApuesta.textContent = `Apuesta: ${jugador.apuesta}`;
    divJugador.appendChild(parrApuesta);
  }

  function pintarPuntos(jugador, index) {
    const divJugador = document.getElementById(`jugador${index + 1}`);
    const parrPuntos = document.createElement("p");
    parrPuntos.id = `puntosJugador${index + 1}`;
    parrPuntos.textContent = `Suma cartas: ${jugador.mano.sumaCartas()}`;
    divJugador.appendChild(parrPuntos);
  }



  function actualizarPuntos(jugador, index) {
    const parrPuntos = document.getElementById(`puntosJugador${index + 1}`);
    const suma = jugador.mano.sumaCartas();
    if (suma > 21) {
      parrPuntos.textContent = `Suma:${suma}(¡HAS PERDIDO!)`;
    } else {
      parrPuntos.textContent = `Suma cartas: ${suma}`;
    }
  }

  function puntosCrupier(crupier) {
    let puntos = crupier.mano.sumaCartas();
    pntCrupier.textContent = puntos;
  }

  function actualizarBalance(jugador, index) {
    const parrBalance = document.getElementById(`balance${index + 1}`);
    const dinero = jugador.dinero;
    parrBalance.textContent = `Balance: ${jugador.dinero}`;
  }

  function pintarCartas(jugador, divCartas) {
    divCartas.innerHTML = ""; //limpio el div
    jugador.mano.cartas.forEach((carta) => {
      let elemCarta = document.createElement("div");
      let nombreClase = claseCarta(carta.toString());
      elemCarta.className = `carta ${nombreClase}`;
      divCartas.appendChild(elemCarta);
    });
  }

  function limpiarDivs(jugadores) {
    jugadores.forEach((jugador, index) => {
      const parrApuesta = document.getElementById(`apuesta${index + 1}`);
      const parrPuntos = document.getElementById(`puntosJugador${index + 1}`);

      if (parrApuesta) {
        parrApuesta.remove();
      }
      if (parrPuntos) {
        parrPuntos.remove();
      }
    });
  }


  function moverCarta(callback){  //callback para que pinte las cartas despues de moverse
    const carta = document.createElement("div");
    carta.classList.add("cartaMoviendose");
    tacoCartas.parentElement.appendChild(carta);
    carta.addEventListener("animationend", () => {
      carta.remove();

    if(callback) callback();
    })
  }
});
