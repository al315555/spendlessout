import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../auth.service";
import {UserData} from "../bos/UserData";

@Component({
  selector: 'app-registercomponent',
  templateUrl: './registercomponent.component.html',
  styleUrls: ['./registercomponent.component.scss'],
})
export class RegistercomponentComponent implements OnInit {

  public usuarioCreatedToLogIn = new UserData();

  constructor(public service: AuthService) { }

  ngOnInit() {}

  saveDataFormSubmit(){
    this.usuarioCreatedToLogIn.timeStampCreacion = new Date().getTime();
    this.service.saveDataRegisterService(this.usuarioCreatedToLogIn);
  }
}
