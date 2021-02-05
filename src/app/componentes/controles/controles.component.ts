import { emitDistinctChangesOnlyDefaultValue } from '@angular/compiler/src/core';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Configuracion } from 'src/app/modelos/configuracion';
import { Partida } from 'src/app/modelos/partida';
import { PartidaService } from 'src/app/servicios/partida.service';

@Component({
  selector: 'app-controles',
  templateUrl: './controles.component.html',
  styleUrls: ['./controles.component.css']
})
export class ControlesComponent implements OnInit {

  partida = new Partida;
  configuracion: Configuracion;


  constructor(private partidaService: PartidaService) { }

  ngOnInit(): void {
    this.partidaService.partida$.subscribe(p=>{
      this.partida = p;
    })
  }

  nuevaPartida(){
    this.partida.estado = 0;
    this.partida.inicio = null;
    this.partida.bombasSinDescubrir = 100;
    this.partidaService.cambiosEnPartida(this.partida);
  }

}
