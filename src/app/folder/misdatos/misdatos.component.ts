import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../auth.service";

@Component({
  selector: 'app-misdatos',
  templateUrl: './misdatos.component.html',
  styleUrls: ['./misdatos.component.scss'],
})
export class MisdatosComponent implements OnInit {

  cambiarPass: boolean;

  constructor(private service: AuthService) { }

  ngOnInit() {this.cambiarPass = false;}

  formatDate(dateMilliseconds: number): string{
    console.log(new Date().getTime());
    console.log(dateMilliseconds);

    const millisecsDiffer = new Date().getTime() - dateMilliseconds;
    const secsDiffer = millisecsDiffer / 1000;
    const minsDiffer = secsDiffer / 60;
    if(minsDiffer < 1){
      return 'hace ' + secsDiffer.toFixed(0) + ' segundos';
    }
    const hoursDiffer = minsDiffer / 60;
    if(hoursDiffer < 1){
      return 'hace ' + minsDiffer.toFixed(0) + ' minuto(s)';
    }
    const daysDiffer = hoursDiffer / 24;
    if(daysDiffer < 1){
      return 'hace ' + hoursDiffer.toFixed(0) + ' hora(s)';
    }
    const weeksDiffer = daysDiffer / 7;
    if(weeksDiffer < 1){
      return 'hace ' + daysDiffer.toFixed(0) + ' día(s)';
    }
    return 'hace ' + weeksDiffer.toFixed(0) + ' semana(s)';
  }

  saveDataFormSubmit(){

  }
}
