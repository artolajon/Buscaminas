import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Celda } from 'src/app/modelos/celda';
import { Configuracion } from 'src/app/modelos/configuracion';
import * as shuffle from 'shuffle-array';
import { Partida } from 'src/app/modelos/partida';
import { PartidaService } from 'src/app/servicios/partida.service';
import { Area } from 'src/app/modelos/area';

const ESTADOS_CELDA = {
  cerrado: 0,
  abierto: 1,
  marcado: 2
}

@Component({
  selector: 'app-juego',
  templateUrl: './juego.component.html',
  styleUrls: ['./juego.component.css']
})
export class JuegoComponent implements OnInit {
  ESTADOS=ESTADOS_CELDA;
  mapa:Array<Celda[]>;
  refCeldas:Celda[];
  bombasAsignadas:boolean = false;

  partida = new Partida;
  configuracion = new Configuracion;


  constructor(private partidaService: PartidaService) { }

  ngOnInit(): void {
    this.partidaService.configuracion$.subscribe(conf=>{
      this.configuracion = conf;
    })


    this.partidaService.partida$.subscribe(p=>{
      this.partida = p;
      if (p.estado == 0)
        this.nuevaPartida();
    })
    this.crearMapa();

  }

  crearMapa(){
    this.refCeldas = [];
    let mapa = new Array<Celda[]>();
    for (let i=0; i<this.configuracion.limiteLineas; i++){
      let linea=[];
      for (let j=0; j<this.configuracion.limiteColumnas; j++){
        let celda = new Celda(i,j);

        linea.push(celda);
        this.refCeldas.push(celda);
      }
      mapa.push(linea);
    }
    this.mapa = mapa;
  }

  nuevaPartida(){
    this.refCeldas.forEach(celda => {
      celda.estado = ESTADOS_CELDA.cerrado;
      celda.valor = 0;
    });
    this.bombasAsignadas = false;
  }

  asignarBombas(){
    this.refCeldas = shuffle(this.refCeldas);

    let cantidadBombas = this.refCeldas.length * this.configuracion.porcentajeBombas /100;
    for(let i=0; i<this.refCeldas.length; i++){
      let celda = this.refCeldas[i];
      if (celda.estado == ESTADOS_CELDA.cerrado){
        cantidadBombas--;
        celda.valor = 9;
        this.establecerArea(celda);

        if (cantidadBombas<=0)
          break;
      }


    }
  }

  establecerArea({linea, columna}){
    let area = new Area(linea, columna);

    Object.keys(area).forEach(posicion =>{
      this.subirValor(area[posicion]);
    });
  }

  subirValor({linea, columna}){
    if(this.mapa[linea] && this.mapa[linea][columna])
      this.mapa[linea][columna].valor++;
  }

  pulsarCelda(celda:Celda){
    if (celda.estado == ESTADOS_CELDA.cerrado){
      this.abrirCelda(celda);
    }else if (celda.estado == ESTADOS_CELDA.abierto){

      if (this.obtenerCantidadDeMarcas(celda) == celda.valor){
        this.abrirArea(celda);
      }

    }
  }

  obtenerCantidadDeMarcas({linea, columna}): number{
    let contador = 0;

    let area = new Area(linea, columna);
    Object.keys(area).forEach(posicion =>{
      if (this.obtenerEstado(area[posicion]) == ESTADOS_CELDA.marcado)
        contador++;
    });
    return contador;
  }

  obtenerEstado({linea, columna}):number{
    if(this.mapa[linea] && this.mapa[linea][columna]){
      return this.mapa[linea][columna].estado;
    }
    return -1;
  }

  abrirCelda({linea, columna}){
    if (this.partida.estado<2){
      if(this.mapa[linea] && this.mapa[linea][columna]){
        let celda = this.mapa[linea][columna];

        if (celda.estado == ESTADOS_CELDA.cerrado ){
          celda.estado = ESTADOS_CELDA.abierto;
          if (this.partida.estado == 0){
            this.partida.estado = 1;
            this.partidaService.cambiosEnPartida(this.partida);
            this.asignarBombas();
          }



          if (celda.valor<9){
            if (celda.valor==0)
              this.abrirArea(celda);

            this.combrobarFinDePartida();
          }
          else{

            this.mostrarBombas();
            this.partida.estado = 2;
            this.partidaService.cambiosEnPartida(this.partida);
          }
        }
      }
    }
  }

  combrobarFinDePartida(){
    if (this.refCeldas.some(c=> c.estado == ESTADOS_CELDA.cerrado && c.valor < 9) == false){
      this.partida.estado = 3;
      this.partidaService.cambiosEnPartida(this.partida);
    }
  }

  mostrarBombas(){
    this.refCeldas.forEach(celda => {
      if(celda.valor>8){
        this.abrirCelda(celda);
      }
    })
  }

  abrirArea({linea, columna}){
    let area = new Area(linea, columna);

    Object.keys(area).forEach(posicion =>{
      this.abrirCelda(area[posicion]);
    });
  }


  marcarCelda({linea, columna}){
    if (this.partida.estado<2){
      if(this.mapa[linea] && this.mapa[linea][columna]){
        let celda = this.mapa[linea][columna];

        if (celda.estado == ESTADOS_CELDA.cerrado){
          celda.estado = ESTADOS_CELDA.marcado;

          this.partida.bombasSinDescubrir--;
          this.partidaService.cambiosEnPartida(this.partida);
        }else if(celda.estado == ESTADOS_CELDA.marcado){
          celda.estado = ESTADOS_CELDA.cerrado;

          this.partida.bombasSinDescubrir++;
          this.partidaService.cambiosEnPartida(this.partida);
        }
      }
    }
    return false;
  }
}
