import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import {HttpClientModule} from "@angular/common/http";
import {AES256} from "@ionic-native/aes-256/ngx";
import {ItinerarioComponent} from "./itinerario/itinerario.component";


@NgModule({
  declarations: [AppComponent, ItinerarioComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, AES256],
  bootstrap: [AppComponent],
})
export class AppModule {}
