import { emitDistinctChangesOnlyDefaultValue } from '@angular/compiler/src/core';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Subscription, timer } from 'rxjs';
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
  configuracion = new Configuracion;
  reloj = timer(0, 1000);
  reloj$: Subscription;

  constructor(private partidaService: PartidaService) { }

  ngOnInit(): void {
    this.partidaService.partida$.subscribe(p=>{
      this.partida = p;
      if (p.estado == 1)
        this.reloj$ = this.reloj.subscribe(c=> this.partida.duracion++);
      if (p.estado == 2)
        this.reloj$.unsubscribe();
    })

    this.partidaService.configuracion$.subscribe(conf=>{
      this.configuracion = conf;
    })
  }

  nuevaPartida(){
    if (this.reloj$)
      this.reloj$.unsubscribe();
    this.partida.estado = 0;
    this.partida.duracion = 0;
    this.partida.bombasSinDescubrir = 100;
    this.partidaService.cambiosEnPartida(this.partida);
  }

}
