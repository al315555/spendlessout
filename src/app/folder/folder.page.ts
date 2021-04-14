import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {AuthService} from "../auth.service";

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {
  public folder: string;
  public folderId: string;

  constructor(private activatedRoute: ActivatedRoute, public service: AuthService) { }

  public appPagesMapping = [
    { title: 'Mis datos', id: 'datos' },
    { title: 'Itinerarios propios', id: 'itinerariospropios' },
    { title: 'Generar itinerario', id: 'generar' },
    { title: 'Itinerarios', id: 'itinerarios'},
    {title: 'Cerrar sesión', id: 'logout' },
    {title: 'Iniciar sesión', id: 'auth'  },
    {title: 'Registrarse', id: 'register'  },
    {title: 'Bienvenido', id: 'Bienvenido'   }
  ];

  ngOnInit() {
    const idFromParamPage = this.activatedRoute.snapshot.paramMap.get('id');
    this.folder = this.appPagesMapping.find(pageMappingElement => pageMappingElement.id == idFromParamPage).title;
    this.folderId = idFromParamPage;
  }

}
