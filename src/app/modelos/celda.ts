export class Celda {
  valor:number=0;
  estado:number=0;
  linea:number=0;
  columna:number=0;
  constructor(linea: number, columna:number){
    this.valor=0;
    this.estado=0;
    this.linea=linea;
    this.columna=columna;
  }
}
