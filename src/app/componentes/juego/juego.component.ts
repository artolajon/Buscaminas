import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Celda } from 'src/app/modelos/celda';
import { Configuracion } from 'src/app/modelos/configuracion';
import * as shuffle from 'shuffle-array';
import { Partida } from 'src/app/modelos/partida';
import { PartidaService } from 'src/app/servicios/partida.service';


@Component({
  selector: 'app-juego',
  templateUrl: './juego.component.html',
  styleUrls: ['./juego.component.css']
})
export class JuegoComponent implements OnInit {

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
        let celda = new Celda();

        celda.linea=i;
        celda.columna=j;

        linea.push(celda);
        this.refCeldas.push(celda);
      }
      mapa.push(linea);
    }
    this.mapa = mapa;
  }

  nuevaPartida(){
    this.refCeldas.forEach(celda => {
      celda.estado = 0;
      celda.valor = 0;
    });
    this.bombasAsignadas = false;
  }

  asignarBombas(){
    this.refCeldas = shuffle(this.refCeldas);

    let cantidadBombas = this.refCeldas.length * this.configuracion.porcentajeBombas /100;
    for(let i=0; i<this.refCeldas.length; i++){
      let celda = this.refCeldas[i];
      if (celda.estado == 0){
        cantidadBombas--;
        celda.valor = 9;
        this.establecerArea(celda.linea, celda.columna);

        if (cantidadBombas<=0)
          break;
      }


    }
  }

  establecerArea(linea: number, columna:number){
    this.subirValor(linea+1, columna+1);
    this.subirValor(linea+1, columna);
    this.subirValor(linea+1, columna-1);

    this.subirValor(linea, columna+1);
    this.subirValor(linea, columna-1);

    this.subirValor(linea-1, columna+1);
    this.subirValor(linea-1, columna);
    this.subirValor(linea-1, columna-1);
  }

  subirValor(linea: number, columna:number){
    if(this.mapa[linea] && this.mapa[linea][columna])
      this.mapa[linea][columna].valor++;
  }

  abrirCelda(linea: number, columna:number){
    if (this.partida.estado<2){
      if(this.mapa[linea] && this.mapa[linea][columna]){
        let celda = this.mapa[linea][columna];

        if (celda.estado == 0 ){
          celda.estado=1;
          if (this.partida.estado==0){
            this.partida.estado = 1;
            this.partidaService.cambiosEnPartida(this.partida);
            this.asignarBombas();
          }



          if (celda.valor==0){
            this.abrirArea(celda.linea, celda.columna);
          }
          else if (celda.valor>=9){

            this.mostrarBombas();
            this.partida.estado = 2;
            this.partidaService.cambiosEnPartida(this.partida);
          }
        }
      }
    }
  }

  mostrarBombas(){
    this.refCeldas.forEach(celda => {
      if(celda.valor>8){
        this.abrirCelda(celda.linea, celda.columna);
      }
    })
  }

  abrirArea(linea: number, columna:number){
    this.abrirCelda(linea+1, columna+1);
    this.abrirCelda(linea+1, columna);
    this.abrirCelda(linea+1, columna-1);

    this.abrirCelda(linea, columna+1);
    this.abrirCelda(linea, columna-1);

    this.abrirCelda(linea-1, columna+1);
    this.abrirCelda(linea-1, columna);
    this.abrirCelda(linea-1, columna-1);
  }
}
