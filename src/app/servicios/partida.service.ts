import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Configuracion } from '../modelos/configuracion';
import { Partida } from '../modelos/partida';

@Injectable({
  providedIn: 'root'
})
export class PartidaService {

  private _partidaSource = new Subject<Partida>();
  partida$ = this._partidaSource.asObservable();
  configuracion = new Configuracion();

  constructor() { }

  cambiosEnPartida(partida){
    this._partidaSource.next(partida);
  }
}
