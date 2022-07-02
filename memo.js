const tipoBomba = 3;
const iconos = ["bi bi-star-fill","bi bi-balloon-fill","bi bi-dice-3-fill","bi bi-robot"];
const colors = ["red","green","blue","black"];

class Participante{
	constructor(nombre, equipo){
		this.nombre = nombre;
		this.equipo = equipo;
		this.perdio = false;
	}
}

class Toast{
	constructor(idToastHTML){
		this.htmlElement = document.getElementById(idToastHTML);
		
	}
	sendMensajeTurno(){
		let opc = {"delay":1500, "autohide":true};
		let toast = new bootstrap.Toast(this.htmlElement, opc);
		
		this.htmlElement.getElementsByClassName("toast-body")[0].innerHTML = `
			<p>Es el turno de <strong>${participantes[0].nombre}</strong></p>
		`;
		
		if(participantes[0].equipo == 0){
			this.htmlElement.classList.remove("bg-primary");
			this.htmlElement.classList.remove("bg-success");
			this.htmlElement.classList.add("bg-danger");
		}
		if(participantes[0].equipo == 1){
			this.htmlElement.classList.remove("bg-primary");
			this.htmlElement.classList.remove("bg-danger");
			this.htmlElement.classList.add("bg-success");
		}
		if(participantes[0].equipo == 2){
			this.htmlElement.classList.remove("bg-danger");
			this.htmlElement.classList.remove("bg-success");
			this.htmlElement.classList.add("bg-primary");
		}

		toast.show();
	}
	sendMensajeAnunciarGanador(ganador){
		var opc = {"autohide": false};
		let toast = new bootstrap.Toast(this.htmlElement, opc);

		this.htmlElement.getElementsByClassName("toast-body")[0].innerHTML = `
			<p><strong>${ganador.nombre}</strong> es el ganador del juego!</p>
		`;

		if(ganador.equipo == 0){
			this.htmlElement.classList.remove("bg-primary");
			this.htmlElement.classList.remove("bg-success");
			this.htmlElement.classList.add("bg-danger");
		}
		if(ganador.equipo == 1){
			this.htmlElement.classList.remove("bg-primary");
			this.htmlElement.classList.remove("bg-danger");
			this.htmlElement.classList.add("bg-success");
		}
		if(ganador.equipo == 2){
			this.htmlElement.classList.remove("bg-danger");
			this.htmlElement.classList.remove("bg-success");
			this.htmlElement.classList.add("bg-primary");
		}
		toast.show();
	}
}

let terminadoPorUltimaCarta = false;
let terminadoPorUltimoPart = false;

let participantes = [];
let cartasTapadas = [9,9,9,9];
let toast = new Toast("toast");

document.getElementById("btn-comenzar").addEventListener("click", comenzarJuego);

function comenzarJuego(){
	let nombreRojo = document.getElementById("campo-nombre-rojo").value;
	let nombreVerde = document.getElementById("campo-nombre-verde").value;
	let nombreAzul = document.getElementById("campo-nombre-azul").value;
	if(nombreRojo != "" && nombreVerde != "" && nombreAzul != ""){
		document.getElementById("form-init").classList.add("d-none");
		let tableroWrapper = document.getElementById("tablero").parentElement;
		tableroWrapper.classList.remove("d-none");
		participantes = [];
		participantes.push(new Participante(nombreRojo,0));
		participantes.push(new Participante(nombreVerde,1));
		participantes.push(new Participante(nombreAzul,2));
		participantes.sort(() => Math.random - 0.5);
		juegoTerminadoUltimaCarta = false;
		juegoTerminadoUltimoParticipante = false;
		createTablero();
		toast.sendMensajeTurno();
	}
}
function createTablero(){
	let tablero = document.getElementById("tablero");
	let tarjetas = [];
	let tarjetaTipo = 0;
	
	for(let i=0; i<36; i++){ 
		tarjetas.push(`
			<div class="col-2 tarjeta-w">
				<div id="tarjeta-${i}" data-type="${tarjetaTipo}" class="tarjeta" onclick="voltearTarjeta(${i})">
					<div class="tarjeta__cara tarjeta__cara--trasera">
						<i class="${iconos[tarjetaTipo]}" style="color:${colors[tarjetaTipo]}"></i>
					</div>
					<div class="tarjeta__cara tarjeta__cara--superior">
						<i class="bi bi-question-diamond-fill"></i>
					</div>
				</div>
			</div>
		`);
		if((i+1)%9 ==0){
			tarjetaTipo++;
		}
	}
	tarjetas.sort(() => Math.random() - 0.5);
	tablero.innerHTML = tarjetas.join(" ");
}

function isJuegoTerminado(){
	var isTerminado = false;
	var nroParticipantesEnJuego = participantes.filter(participante => !participante.perdio).length;
	if(nroParticipantesEnJuego == 1){
		terminadoPorUltimoPart = true;
		isTerminado = true;
	}
	var sinCartas = cartasTapadas.filter(carta => carta == 0).length;
	if(sinCartas > 0){
		terminadoPorUltimaCarta = true;
		isTerminado = true;
	}
	return isTerminado;
}

function anunciarGanador(){
	if(terminadoPorUltimaCarta){
		let equipoGanador = cartasTapadas.findIndex(carta => carta == 0);
		let ganador = participantes.find(participante => participante.equipo == equipoGanador);
		toast.sendMensajeAnunciarGanador(ganador);
	}
	else{
		if(terminadoPorUltimoPart){
			let ganador = participantes.find(participante => !participante.perdio);
			toast.sendMensajeAnunciarGanador(ganador);
		}
	}
}

function voltearTarjeta(index){
	if(!terminadoPorUltimaCarta && !terminadoPorUltimoPart){
		let tarjeta = document.getElementById("tarjeta-"+index);
		if(tarjeta.style.transform != "rotateY(180deg)"){
			tarjeta.style.transform = "rotateY(180deg)";
			let tarjetaTipo = tarjeta.getAttribute("data-type");
			cartasTapadas[tarjetaTipo]--;
			if(tarjetaTipo == tipoBomba){
				participantes[0].perdio = true;
			}
			if(isJuegoTerminado()){
				console.log("Juego terminado");
				anunciarGanador();
			}
			else{
				if(tarjetaTipo == tipoBomba || tarjetaTipo == participantes[0].equipo){
					pasarTurno();
					if(participantes[0].perdio){
						pasarTurno();
					}
					toast.sendMensajeTurno();
				}
			}
		}
	}
}

function pasarTurno(){
	let participante = participantes[0];
	participantes.shift();
	participantes.push(participante);
}