import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../auth.service";

@Component({
  selector: 'app-registercomponent',
  templateUrl: './registercomponent.component.html',
  styleUrls: ['./registercomponent.component.scss'],
})
export class RegistercomponentComponent implements OnInit {

  constructor(private service: AuthService) { }

  ngOnInit() {}

  saveDataFormSubmit(){

  }
}
