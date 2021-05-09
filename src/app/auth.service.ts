import { Injectable } from '@angular/core';
import {AES256} from "@ionic-native/aes-256/ngx";
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
// import { HTTP } from '@ionic-native/http/ngx';
import {AuthToken} from "./folder/bos/AuthToken";
import {UserData} from "./folder/bos/UserData";
import {ModalController, NavController} from "@ionic/angular";
import {Town} from "./folder/bos/Town";
import {Observable} from "rxjs";
import {Itinerario} from "./folder/bos/Itinerario";
import {ItinerarioComponent} from "./itinerario/itinerario.component";
import {GeneraritinerarioComponent} from "./folder/generaritinerario/generaritinerario.component";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public itinerarioSelected: Itinerario;

  public loading = false;
  public tokenAuth = new AuthToken();
  private secureKey: string;
  private secureIV: string;
  public usuarioToLogIn = new UserData();

  constructor(public http: HttpClient, private navCtrl: NavController, private aes256: AES256, public modalController: ModalController) {
    if(localStorage.getItem("token") !== null && localStorage.getItem("token") !== "" &&
       localStorage.getItem("tokenValidTime") && +localStorage.getItem("tokenValidTime") > 0  ){
      this.tokenAuth.token = localStorage.getItem("token");
      this.tokenAuth.timeIsValid = +localStorage.getItem("tokenValidTime");
      if(this.isLogged){
        this.retrieveUserData(this.tokenAuth);
      }else{
        alert('La sesión ha caducado, autenticación requerida');
        this.navCtrl.navigateRoot('/folder/auth');
      }
    }
  }

  private static initHeaders(): HttpHeaders{
    const headers = new HttpHeaders()
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json');
    return headers;
  }

  async encryptar(pusuarioToLogIn: UserData){

    //pusuarioToLogIn.password = pusuarioToLogIn.password + 'Encrypted';

    //Only available inside a device

    this.secureKey = await this.aes256.generateSecureKey('spendlessout'); // Returns a 32 bytes string
    this.secureIV = await this.aes256.generateSecureIV('spendlessout'); // Returns a 16 bytes string

    this.aes256.encrypt(this.secureKey, this.secureIV, pusuarioToLogIn.password)
      .then(res => {
        pusuarioToLogIn.password = res;
        pusuarioToLogIn.passwordConfirmation = res;
        console.log('Encrypted Data: ',res)
      })
      .catch((error: any) => alert(JSON.stringify(error)));

  }

  get isLogged() {
    return this.tokenAuth.timeIsValid > new Date().getTime();
  }

  townItemsRetrieval(pTownName: string): Observable<Object>{
    this.loading = true;
    return this.http.get("https://spendlessoutapi.herokuapp.com/server/api/v1/towns?cityname="+pTownName.trim());
  }

  townFullDateItemRetrieval(pTownName: string): Observable<Object>{
    this.loading = true;
    return this.http.get("https://spendlessoutapi.herokuapp.com/server/api/v1/towns/findfullData?fullCityName="+pTownName.trim());
  }

  getActivitiesFromItinerario(pItinerarioId: number){
    this.loading = true;
    return this.http.get("https://spendlessoutapi.herokuapp.com/server/api/v1/itinerario/actividades?itinerarioId="+pItinerarioId, { headers: AuthService.initHeaders() , observe: 'response'});
  }

  getItinerariosFromActivitiesFromItinerario(){
    return this.http.get("https://spendlessoutapi.herokuapp.com/server/api/v1/user/itinerario/listado?userId="+this.usuarioToLogIn.id, { headers: AuthService.initHeaders() , observe: 'response'});
  }

  getFilteredItinerariosFromActivitiesFromItinerario(selectedTown: Town){
    return this.http.get("https://spendlessoutapi.herokuapp.com/server/api/v1/user/itinerario/listadobytown?userId="+this.usuarioToLogIn.id+'&townName='+selectedTown.name+'&townLat='+selectedTown.lat+'&townLon='+selectedTown.lon, { headers: AuthService.initHeaders() , observe: 'response'});
  }

  getFilteredItinerarios(selectedTown: Town){
    return this.http.get("https://spendlessoutapi.herokuapp.com/server/api/v1/itinerario/listado?townName="+selectedTown.name+'&townLat='+selectedTown.lat+'&townLon='+selectedTown.lon, { headers: AuthService.initHeaders() , observe: 'response'});
  }

  async saveDataRegisterService(pusuarioToLogIn: UserData){
    this.loading = true;
    //await this.encryptar(); //Only available inside a device
    // await this.encryptar(pusuarioToLogIn);
    this.http.get("https://spendlessoutapi.herokuapp.com/server/api/v1/user/registered?email="+pusuarioToLogIn.email.trim(), { headers: AuthService.initHeaders() , observe: 'response'})
      .subscribe((res:HttpResponse<Boolean>) => {
        if(res.body){
          alert('Correo electrónico invalido , ya existe una cuenta asociada a ' +pusuarioToLogIn.email.trim());
        }else{
          this.http.post("https://spendlessoutapi.herokuapp.com/server/api/v1/user/auth/register", pusuarioToLogIn, { headers: AuthService.initHeaders(), observe: 'response'})
            .subscribe((res:HttpResponse<AuthToken>) => {
              this.tokenAuth = res.body;
              localStorage.setItem("token", this.tokenAuth.token);
              localStorage.setItem("tokenValidTime", this.tokenAuth.timeIsValid+'');
              pusuarioToLogIn.password = '';
              pusuarioToLogIn.passwordConfirmation = '';
              pusuarioToLogIn.passwordChanged = false;
              this.retrieveUserData(res.body);
            }, error => {
              console.log(error);
              pusuarioToLogIn.password = '';
              pusuarioToLogIn.passwordConfirmation = '';
              pusuarioToLogIn.passwordChanged = false;
              this.loading = false;
              alert(JSON.stringify(error));
            });
        }
      }, error => {
        this.loading = false;
        alert(JSON.stringify(error));
      });

  }

  async loginService(pusuarioToLogIn: UserData) {

    // await this.encryptar(pusuarioToLogIn);
    this.loading = true;
    this.http.post("https://spendlessoutapi.herokuapp.com/server/api/v1/user/auth", pusuarioToLogIn, { headers: AuthService.initHeaders() , observe: 'response'})
      .subscribe((res:HttpResponse<AuthToken>) => {
        this.tokenAuth = res.body;
        localStorage.setItem("token", this.tokenAuth.token);
        localStorage.setItem("tokenValidTime", this.tokenAuth.timeIsValid+'');
        pusuarioToLogIn.password = '';
        pusuarioToLogIn.passwordConfirmation = '';
        pusuarioToLogIn.passwordChanged = false;
        this.retrieveUserData(res.body);
      }, error => {
        pusuarioToLogIn.password = '';
        pusuarioToLogIn.passwordConfirmation = '';
        pusuarioToLogIn.passwordChanged = false;
        this.loading = false;
        console.log(JSON.stringify(error));
        alert('Usuario o contraseña invalidos')
      });
  }

  retrieveUserData(pDataToken: AuthToken){
    let headers = AuthService.initHeaders();
    headers = headers.set('Authorization-Bearer', pDataToken.token);
    this.http.get("https://spendlessoutapi.herokuapp.com/server/api/v1/user/auth/userdata", { headers: headers , observe: 'response'})
      .subscribe((res:HttpResponse<UserData>) => {
        this.usuarioToLogIn = res.body;
        if(this.isLogged)
          this.navCtrl.navigateRoot('/folder/itinerarios');
      }, error => {
        this.errorThrowed(error);
      });
    this.refreshToken();
  }

  refreshToken(){
    let headers = AuthService.initHeaders();
    headers = headers.set('Authorization-Bearer', this.tokenAuth.token);
    this.http.get("https://spendlessoutapi.herokuapp.com/server/api/v1/user/auth/refreshToken", { headers: headers , observe: 'response'})
      .subscribe((res:HttpResponse<AuthToken>) => {
        this.tokenAuth = res.body;
        localStorage.setItem("token", this.tokenAuth.token);
        localStorage.setItem("tokenValidTime", this.tokenAuth.timeIsValid+'');
        this.loading = false;
      }, error => {
        this.errorThrowed(error);
        this.loading = false;
      });
  }

  generateItinerarioData(itinerario: Itinerario, generador: GeneraritinerarioComponent){
    this.loading = true;
    let headers = AuthService.initHeaders();
    headers = headers.set('Authorization-Bearer', this.tokenAuth.token);
    this.loading = true;
    this.http.post("https://spendlessoutapi.herokuapp.com/server/api/v1/itinerario/generar", itinerario, { headers: headers, observe: 'response'})
      .subscribe((res:HttpResponse<Itinerario>) => {
        this.itinerarioSelected = res.body;
        generador.generarViewItinerario(this.itinerarioSelected );

      }, error => {
        console.log(error);
        alert('No sé ha podido generar | ' + JSON.stringify(error) );
      });
    this.refreshToken();
  }


  async saveOwnData(){

    let headers = AuthService.initHeaders();
    headers = headers.set('Authorization-Bearer', this.tokenAuth.token);
    await this.encryptar(this.usuarioToLogIn);

    this.http.post("https://spendlessoutapi.herokuapp.com/server/api/v1/user/auth/editdata", this.usuarioToLogIn, { headers: headers, observe: 'response'})
      .subscribe((res:HttpResponse<UserData>) => {
        this.loading = true;
        this.usuarioToLogIn = res.body;
        this.clearPassFields();
      }, error => {
        this.errorThrowed(error);
      });
    this.refreshToken();
  }

  private clearPassFields(){
    this.usuarioToLogIn.password = '';
    this.usuarioToLogIn .passwordConfirmation = '';
    this.usuarioToLogIn.passwordChanged = false;
    this.loading = false;
  }

  private errorThrowed(error){
    console.log(error);
    this.clearSessionData();
    this.loading = false;
    alert(JSON.stringify(error));
  }

  logout(){
    this.clearSessionData();
    this.navCtrl.navigateRoot('/folder/itinerarios');
    alert('Sesión cerrada.');
  }

  cancelarLogout(){
    this.navCtrl.navigateRoot('/folder/itinerarios');
  }

  private clearSessionData() {
    const emailToSave = this.usuarioToLogIn.email;
    this.tokenAuth = new AuthToken();
    this.usuarioToLogIn = new UserData();
    this.usuarioToLogIn.email = emailToSave;
    localStorage.setItem("token",null);
    localStorage.setItem("tokenValidTime", null);
  }
}
