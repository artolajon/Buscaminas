import { Celda } from "./celda";

export class Area {
  arribaIzquierda: Celda;
  arriba: Celda;
  arribaDerecha: Celda;

  izquierda: Celda;
  derecha: Celda;

  abajoIzquierda: Celda;
  abajo: Celda;
  abajoDerecha: Celda;

  constructor(linea: number, columna: number){
    this.arribaIzquierda = new Celda(linea+1, columna+1);
    this.arriba= new Celda(linea+1, columna );
    this.arribaDerecha= new Celda(linea+1, columna-1 );

    this.izquierda= new Celda(linea, columna+1 );
    this.derecha= new Celda(linea, columna-1 );

    this.abajoIzquierda= new Celda(linea-1, columna+1 );
    this.abajo= new Celda(linea-1, columna );
    this.abajoDerecha= new Celda(linea-1, columna-1 );
  }

}
