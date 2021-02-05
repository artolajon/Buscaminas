import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DragScrollModule } from 'ngx-drag-scroll';

import { AppComponent } from './app.component';
import { JuegoComponent } from './componentes/juego/juego.component';
import { ControlesComponent } from './componentes/controles/controles.component';

@NgModule({
  declarations: [
    AppComponent,
    JuegoComponent,
    ControlesComponent
  ],
  imports: [
    BrowserModule,
    DragScrollModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
