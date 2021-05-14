import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../auth.service";
import {UserData} from "../bos/UserData";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-misdatos',
  templateUrl: './misdatos.component.html',
  styleUrls: ['./misdatos.component.scss'],
})
export class MisdatosComponent implements OnInit {

  public checkboxpassvalue: boolean;

  public msgPassRequirements = '** Mínimo 6 carácteres, 1 mayúscula, 1 minúscula y 1 dígito hasta un máximo de 16 caractéres.';
  public regexForPassword = '((?=.*[0-9])|(?=.*[^a-zA-Z0-9_]+))(?=.*[A-Z])(?=.*[a-z]).*$';

  public dataformGroup = this.formBuilder.group({
      nombre: [this.service.usuarioToLogIn.nombre,[Validators.required, Validators.minLength(1), Validators.maxLength(25)]],
      apellidos: [this.service.usuarioToLogIn.apellidos,[Validators.required, Validators.minLength(1), Validators.maxLength(60)]],
      }
  );

  public passformGroup = this.formBuilder.group({
      password: [this.service.usuarioToLogIn.password,[Validators.required,Validators.minLength(6), Validators.maxLength(16), Validators.pattern(this.regexForPassword)]],
      passwordConfirmation: [this.service.usuarioToLogIn.passwordConfirmation,[Validators.required, Validators.minLength(6), Validators.maxLength(16), Validators.pattern(this.regexForPassword)]]
    },
    {validators: this.passwordsAreEquals}
  );

  passwordsAreEquals(group: FormGroup){
    if (!group ||
      !group.get('password').value || !group.get('passwordConfirmation').value ||
      group.get('password').value === group.get('passwordConfirmation').value ){
      return null; //toCorrectValue
    }
    return {passNotEquals: 'Las contraseñas no coinciden'};
  }

  constructor(public service: AuthService, public formBuilder: FormBuilder) { }

  ngOnInit() { this.checkboxpassvalue = false;}

  formatDate(dateMilliseconds: number): string{
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
    this.service.saveOwnData();
  }

  changeCheckBox(event){
    console.log(this.checkboxpassvalue);
    const boolPass = this.checkboxpassvalue;
    if(!boolPass) {
      this.service.usuarioToLogIn.password = '';
      this.service.usuarioToLogIn.passwordConfirmation = '';
    }
    this.service.usuarioToLogIn.passwordChanged = boolPass;
  }

  get cambiarPass(){
    return this.service.usuarioToLogIn.passwordChanged;
  }

  set cambiarPass(boolPass:boolean){
    if(!boolPass) {
      this.service.usuarioToLogIn.password = '';
      this.service.usuarioToLogIn.passwordConfirmation = '';
    }
    this.service.usuarioToLogIn.passwordChanged = boolPass;
  }
}
