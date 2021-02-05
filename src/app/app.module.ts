import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DragScrollModule } from 'ngx-drag-scroll';

import { AppComponent } from './app.component';
import { JuegoComponent } from './componentes/juego/juego.component';
import { ControlesComponent } from './componentes/controles/controles.component';
import { TimePipe } from './pipes/time.pipe';

@NgModule({
  declarations: [
    AppComponent,
    JuegoComponent,
    ControlesComponent,
    TimePipe
  ],
  imports: [
    BrowserModule,
    DragScrollModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
