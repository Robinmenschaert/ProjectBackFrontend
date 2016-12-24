import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { GamePageComponent } from './pages/game-page/game-page.component';
import { GameCanvasDirective } from './directives/game-canvas.directive';

@NgModule({
  declarations: [
    AppComponent,
    GamePageComponent,
    GameCanvasDirective
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
