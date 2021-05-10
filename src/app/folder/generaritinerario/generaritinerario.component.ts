import {Component, OnInit, SystemJsNgModuleLoader} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {AuthService} from "../../auth.service";
import {Itinerario} from "../bos/Itinerario";
import {DatePipe} from "@angular/common";
import {Town} from "../bos/Town";
import {ItinerarioComponent} from "../../itinerario/itinerario.component";
import {ModalController} from "@ionic/angular";

@Component({
  selector: 'app-generaritinerario',
  templateUrl: './generaritinerario.component.html',
  styleUrls: ['./generaritinerario.component.scss'],
  providers: [DatePipe]
})
export class GeneraritinerarioComponent implements OnInit {

  itinerario: Itinerario = new Itinerario();

  public dataformGroup = this.formBuilder.group({
      ubicacionNombre: [this.itinerario.ubicacionNombre, [Validators.required]],
      nombre: [this.itinerario.nombre, [Validators.required]],
      radio: [this.itinerario.radio, [Validators.required]],
      precioTotal: [this.itinerario.precioTotal, [Validators.required]],
      hasCar: [this.itinerario.hasCar, []],
      timeStampFrom: [this.itinerario.timeStampFrom, [Validators.required]],
      timeStampTo: [this.itinerario.timeStampTo, [Validators.required]],
    }
  );

  constructor(public service: AuthService, public formBuilder: FormBuilder, private datePipe: DatePipe, public modalController: ModalController) {
  }

  public hiddenCarToggle: boolean = false;

  onChangeRadio(event){
    this.hiddenCarToggle = this.dataformGroup && this.dataformGroup.value.radio && this.dataformGroup.value.radio > 3;
  }

  ngOnInit() {
  }

  async generarViewItinerario(itinerario: Itinerario){
    this.itinerario = itinerario;
    const modal = await this.modalController.create({
      component: ItinerarioComponent,
      componentProps: {itinerario: this.itinerario}
    });
    return await modal.present();
  }

  generateFormSubmit() {
    this.service.loading = true;
    this.itinerario.id = 0;
    this.itinerario.nombre = this.dataformGroup.value.nombre;
    this.itinerario.timeStampTo = new Date(this.dataformGroup.value.timeStampTo).getTime();
    this.itinerario.timeStampFrom = new Date(this.dataformGroup.value.timeStampFrom).getTime();
    this.itinerario.hasCar = this.dataformGroup.value.hasCar;
    this.itinerario.radio = this.dataformGroup.value.radio;
    this.itinerario.precioTotal = this.dataformGroup.value.precioTotal;
    this.itinerario.timeStampCreacion = Date.now();
    this.itinerario.idUser = this.service.usuarioToLogIn.id;
    console.log(this.itinerario);
    this.service.itinerarioSelected = this.itinerario;
    this.service.generateItinerarioData(this.itinerario, this);
    this.generarViewItinerario(this.service.itinerarioSelected);
    this.dataformGroup.reset();
  }

  get currentDateWoTime(){
    return new Date();
  }

  get currentDate() {
    return this.datePipe.transform(Date.now(), 'yyyy-MM-dd');
  }

  get nextDate() {
    let datePrev = new Date();
    datePrev.setTime(datePrev.getTime() + (3600 * 1000 * 24 * 2));
    datePrev.setHours(0);
    datePrev.setMinutes(0);
    return this.datePipe.transform(datePrev, 'yyyy-MM-dd');
  }

  get maxDate() {
    let maxdate = new Date(Date.now());
    maxdate.setFullYear(maxdate.getFullYear() + 1);
    return maxdate.getFullYear();
  }

  isItemAvailable = false;
  valueFromSearchBar = '';
  items: Town[] = [];
  itemTownSelected: Town = new Town();
  isItemTownSelected: boolean = false;

  showTownItems(ev: any) {
    this.service.loading = true;
    // set val to the value of the searchbar
    console.log(ev.target.value);
    this.valueFromSearchBar = ev.target.value;
    this.items = [];
    // if the value is an empty string or its size less than 3 don't filter the items
    if ((this.valueFromSearchBar && this.valueFromSearchBar.trim() !== '' && this.valueFromSearchBar.length > 2 )) {
      this.isItemAvailable = true;
      this.service.loading = true;
      let jsonData;
      this.service.townItemsRetrieval(this.valueFromSearchBar).subscribe(data => {
        jsonData = data;
        this.service.loading = true;
        for (let item of jsonData.data) {
          this.items.push(item);
        }
        this.service.loading = false;
      }, error => {
        this.isItemAvailable = false;
        this.service.loading = false;
        this.items = [];
        console.error(error);
        // alert(error);
      });
      this.service.loading = false;
    } else {
      this.isItemAvailable = false;
      this.service.loading = false;
      this.items = [];
    }
  }

  selectionOfItemTown(itemTown: Town) {
    this.isItemAvailable = false;
    this.service.loading = false;
    this.items = [];
    let jsonData;
    console.log(itemTown);
    this.service.townFullDateItemRetrieval(itemTown.name).subscribe(data => {
      jsonData = data;
      this.service.loading = true;
      this.itemTownSelected = jsonData;
      if(this.itemTownSelected){
        this.isItemTownSelected = true;
        this.dataformGroup.value.ubicacionNombre = jsonData.name;
        this.itinerario.ubicacionNombre = jsonData.name;
        this.itinerario.ubicacionLat = jsonData.lat;
        this.itinerario.ubicacionLon = jsonData.lon;
      }else{
        this.isItemTownSelected = false;
        alert('Ubicación desconocida, seleccione otra población.');
      }
      this.service.loading = false;
      console.log(this.itemTownSelected);
    }, error => {
      this.isItemAvailable = false;
      this.service.loading = false;
      this.isItemTownSelected = false;
      console.error(error);
      alert('Ubicación desconocida, seleccione otra población.');
    });
  }
}
