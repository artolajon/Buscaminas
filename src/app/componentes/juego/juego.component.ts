import { Component, OnInit } from '@angular/core';
import { Celda } from 'src/app/modelos/celda';
import { Configuracion } from 'src/app/modelos/configuracion';

@Component({
  selector: 'app-juego',
  templateUrl: './juego.component.html',
  styleUrls: ['./juego.component.css']
})
export class JuegoComponent implements OnInit {

  mapa:Array<Celda[]>;
  refCeldas:Celda[];

  configuracion: Configuracion;

  constructor() { }

  ngOnInit(): void {
    this.configuracion = {
      limiteColumnas: 30,
      limiteLineas: 16,
      porcentajeBombas: 10,
    };
    this.crearMapa();

  }

  crearMapa(){
    this.refCeldas = [];
    let mapa = new Array<Celda[]>();
    for (let i=0; i<this.configuracion.limiteLineas; i++){
      let linea=[];
      for (let j=0; j<this.configuracion.limiteColumnas; j++){
        let celda = new Celda();
        linea.push(celda);
        this.refCeldas.push(celda);
      }
      mapa.push(linea);
    }
    this.mapa = mapa;
  }
}
