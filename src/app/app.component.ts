import { Component } from '@angular/core';
import {AuthService} from "./auth.service";
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { displayOnLogout: false, displayOnLogin: true,  title: 'Mis datos', url: '/folder/datos', icon: 'folder' },
    { displayOnLogout: false, displayOnLogin: true,  title: 'Itinerarios propios', url: '/folder/itinerariospropios', icon: 'list' },
    { displayOnLogout: false, displayOnLogin: true,  title: 'Generar itinerario', url: '/folder/generar', icon: 'add' },
    { displayOnLogout: true,  displayOnLogin: true,  title: 'Itinerarios', url: '/folder/itinerarios', icon: 'compass' },
    { displayOnLogout: false, displayOnLogin: true,  title: 'Cerrar sesión', url: '/folder/logout', icon: 'log-out' },
    { displayOnLogout: true,  displayOnLogin: false, title: 'Iniciar sesión', url: '/folder/auth', icon: 'log-in' },
    { displayOnLogout: true,  displayOnLogin: false, title: 'Registrarse', url: '/folder/register', icon: 'person-add' }
  ];

  public titlestr = "Ocio por lo justo - spendlessout ©2021";

  constructor(private service: AuthService) {}
}
