import { Injectable } from '@angular/core';
import {AES256} from "@ionic-native/aes-256";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AuthToken} from "./folder/bos/AuthToken";
import {UserData} from "./folder/bos/UserData";
import {NavController} from "@ionic/angular";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public tokenAuth = new AuthToken();
  private secureKey: string;
  private secureIV: string;
  public usuarioToLogIn = new UserData();

  constructor(public http: HttpClient, private navCtrl: NavController) { }

  private initHeaders(): HttpHeaders{
    const headers = new HttpHeaders()
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json');
    return headers;
  }

  async encryptar(){
    this.secureKey = await AES256.generateSecureKey('spendlessout'); // Returns a 32 bytes string
    this.secureIV = await AES256.generateSecureIV('spendlessout'); // Returns a 16 bytes string

    AES256.encrypt(this.secureKey, this.secureIV, this.usuarioToLogIn.password)
      .then(res => {
        this.usuarioToLogIn.password = res;
        console.log('Encrypted Data: ',res)
      })
      .catch((error: any) => console.error(error));

  }

  async encryptarMock(){
    this.usuarioToLogIn.password = this.usuarioToLogIn.password + 'Encrypted';
  }

  get isLogged() {
    return this.tokenAuth.timeIsValid > new Date().getTime();
  }

  async loginService(pusuarioToLogIn: UserData) {

    this.usuarioToLogIn = pusuarioToLogIn;
    //await this.encryptar(); //Only available inside a device
    await this.encryptarMock();

    this.http.post("/apis/user/auth", pusuarioToLogIn, { headers: this.initHeaders() })
      .subscribe((data: any) => {
        this.tokenAuth = data;
        this.usuarioToLogIn.password = '';
        this.retriveUserData(data);
      }, error => {
        console.log(error);
        this.usuarioToLogIn.password = '';
      });
  }

  retriveUserData(pDataToken: any){
    let headers = this.initHeaders();
    headers = headers.set('Authorization-Bearer', pDataToken.token);
    console.log(pDataToken.token);
    console.log(headers);
    this.http.get("/apis/user/auth/userdata", { headers: headers })
      .subscribe((data: any) => {
        console.log(data);
        this.usuarioToLogIn = data;
        if(this.isLogged)
          this.navCtrl.navigateRoot('/folder/datos');
      }, error => {
        this.usuarioToLogIn.password = '';
      });
  }

}
