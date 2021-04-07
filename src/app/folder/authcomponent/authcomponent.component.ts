import { Component, OnInit } from '@angular/core';
import {AES256} from '@ionic-native/aes-256';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {AuthService} from "../../auth.service";
import {UserData} from "../bos/UserData";

@Component({
  selector: 'app-authcomponent',
  templateUrl: './authcomponent.component.html',
  styleUrls: ['./authcomponent.component.scss'],
})
export class AuthcomponentComponent implements OnInit {

  public usuarioToLogIn = new UserData();

  constructor(public http: HttpClient, private service: AuthService) {}

  ngOnInit() {}

  logFormSubmit() {
    this.service.loginService(this.usuarioToLogIn);
  }

}
