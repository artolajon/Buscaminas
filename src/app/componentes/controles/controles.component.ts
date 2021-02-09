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
  reloj$: Subscription = Subscription.EMPTY;

  constructor(private partidaService: PartidaService) { }

  ngOnInit(): void {

    this.partidaService.partida$.subscribe(p=>{
      this.partida = p;
      if (p.estado == 1 && this.reloj$.closed)
        this.reloj$ = this.reloj.subscribe(c=> this.partida.duracion++);
      if (p.estado == 2)
        this.reloj$.unsubscribe();
      if (p.estado == 3){
        this.reloj$.unsubscribe();
        alert("Ganaste!!");
      }

    })

    this.partidaService.configuracion$.subscribe(conf=>{
      this.configuracion = conf;
    })
    this.nuevaPartida();
  }

  nuevaPartida(){
    this.reloj$.unsubscribe();
    this.partida.estado = 0;
    this.partida.duracion = 0;
    let bombas = this.configuracion.limiteColumnas * this.configuracion.limiteLineas * this.configuracion.porcentajeBombas / 100;
    this.partida.bombasSinDescubrir = Math.floor(bombas);
    this.partidaService.cambiosEnPartida(this.partida);
  }

}
