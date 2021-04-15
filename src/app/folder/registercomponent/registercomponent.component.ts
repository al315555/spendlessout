import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../auth.service";
import {UserData} from "../bos/UserData";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-registercomponent',
  templateUrl: './registercomponent.component.html',
  styleUrls: ['./registercomponent.component.scss'],
})
export class RegistercomponentComponent implements OnInit {

  public msgPassRequirements = '** Mínimo 6 carácteres, 1 mayúscula, 1 minúscula y 1 dígito hasta un máximo de 16 caractéres.';
  public regexForPassword = '((?=.*[0-9])|(?=.*[^a-zA-Z0-9_]+))(?=.*[A-Z])(?=.*[a-z]).*$';
  public usuarioCreatedToLogIn = new UserData();

  public registerformGroup = this.formBuilder.group({
      email: [this.usuarioCreatedToLogIn.email,[Validators.required, Validators.minLength(1), Validators.maxLength(50), Validators.email]],
      nombre: [this.usuarioCreatedToLogIn.nombre,[Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      apellidos: [this.usuarioCreatedToLogIn.apellidos,[Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      password: [this.usuarioCreatedToLogIn.password,[Validators.required,Validators.minLength(6), Validators.maxLength(16), Validators.pattern(this.regexForPassword)]],
      passwordConfirmation: [this.usuarioCreatedToLogIn.passwordConfirmation,[Validators.required, Validators.minLength(6), Validators.maxLength(16), Validators.pattern(this.regexForPassword)]]
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

  ngOnInit() {}

  saveDataFormSubmit(){
    this.usuarioCreatedToLogIn.timeStampCreacion = new Date().getTime();
    this.service.saveDataRegisterService(this.usuarioCreatedToLogIn);
  }
}
