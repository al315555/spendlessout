import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {FolderPageRoutingModule} from './folder-routing.module';

import {FolderPage} from './folder.page';
import {RegistercomponentComponent} from "./registercomponent/registercomponent.component";
import {AuthcomponentComponent} from "./authcomponent/authcomponent.component";
// import {generate} from "rxjs";
import {GeneraritinerarioComponent} from "./generaritinerario/generaritinerario.component";
import {ItinerariosComponent} from "./itinerarios/itinerarios.component";
import {ItinerariospropiosComponent} from "./itinerariospropios/itinerariospropios.component";
import {MisdatosComponent} from "./misdatos/misdatos.component";
import {HttpClientModule} from "@angular/common/http";


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FolderPageRoutingModule,
    HttpClientModule
  ],
  declarations: [FolderPage,
    RegistercomponentComponent,
    AuthcomponentComponent,
    GeneraritinerarioComponent,
    ItinerariosComponent,
    ItinerariospropiosComponent,
    MisdatosComponent
  ]
})
export class FolderPageModule {
}
