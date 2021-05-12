import {Component, OnInit, SystemJsNgModuleLoader} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../auth.service";
import {Itinerario} from "../bos/Itinerario";
import {DatePipe} from "@angular/common";
import {Town} from "../bos/Town";
import {ItinerarioComponent} from "../../itinerario/itinerario.component";
import {ModalController} from "@ionic/angular";
import {HttpResponse} from "@angular/common/http";

@Component({
  selector: 'app-generaritinerario',
  templateUrl: './generaritinerario.component.html',
  styleUrls: ['./generaritinerario.component.scss'],
  providers: [DatePipe]
})
export class GeneraritinerarioComponent implements OnInit {

  itinerario: Itinerario = new Itinerario();

  public dataformGroup = this.formBuilder.group({
      ubicacionNombre: [this.itinerario.ubicacionNombre, [Validators.required, Validators.minLength(3), Validators.maxLength(210)]],
      nombre: [this.itinerario.nombre, [Validators.required, Validators.minLength(3), Validators.maxLength(210)]],
      radio: [this.itinerario.radio, [Validators.required]],
      precioTotal: [this.itinerario.precioTotal, [Validators.required]],
      hasCar: [this.itinerario.hasCar, []],
      timeStampFrom: [this.itinerario.timeStampFrom, [Validators.required]],
      timeStampTo: [this.itinerario.timeStampTo, [Validators.required]],
    },
    {validators: this.fromIsLessThanTo}
  );

  fromIsLessThanTo(group: FormGroup){
    let fromDate = new Date(group.get('timeStampFrom').value)
    let toDate = new Date(group.get('timeStampTo').value)

    let fromDateString = fromDate.getUTCDate().toString().padStart(2, "0")
      + fromDate.getUTCMonth().toString().padStart(2, "0")
      + fromDate.getFullYear()
      + fromDate.getUTCHours().toString().padStart(2, "0")
      + fromDate.getUTCMinutes().toString().padStart(2, "0") ;

    let toDateString = toDate.getUTCDate().toString().padStart(2, "0")
      + toDate.getUTCMonth().toString().padStart(2, "0")
      + toDate.getFullYear()
      + toDate.getUTCHours().toString().padStart(2, "0")
      + toDate.getUTCMinutes().toString().padStart(2, "0");

    console.log(group.get('timeStampFrom').value);
    console.log(group.get('timeStampTo').value);

    let areFromDateLessThanToDate = fromDateString < toDateString;
    if(areFromDateLessThanToDate ||
      (group.get('timeStampFrom').value === null && group.get('timeStampTo').value === null)){
      return null;
    }
    return {areNotFromDateLessThanToDate: 'La primera fecha debe ser menor que la segunda'};
  }

  constructor(public service: AuthService, public formBuilder: FormBuilder, private datePipe: DatePipe, public modalController: ModalController) {
  }

  public hiddenCarToggle: boolean = false;

  onChangeRadio(event){
    this.hiddenCarToggle = this.dataformGroup && this.dataformGroup.value.radio && this.dataformGroup.value.radio > 3;
  }

  ngOnInit() {
  }

  async generarViewItinerario(itinerario: Itinerario){
    this.dataformGroup.reset();
    this.itinerario = itinerario;
    const modal = await this.modalController.create({
      component: ItinerarioComponent,
      componentProps: {itinerario: this.itinerario}
    });
    return await modal.present();
  }

  generateFormSubmit() {
    this.itinerario.id = 0;
    this.itinerario.nombre = this.dataformGroup.value.nombre;
    this.itinerario.timeStampTo = new Date(this.dataformGroup.value.timeStampTo).getTime();
    this.itinerario.timeStampFrom = new Date(this.dataformGroup.value.timeStampFrom).getTime();
    this.itinerario.hasCar = this.dataformGroup.value.hasCar;
    this.itinerario.radio = this.dataformGroup.value.radio;
    this.itinerario.precioTotal = this.dataformGroup.value.precioTotal;
    this.itinerario.timeStampCreacion = Date.now();
    this.itinerario.idUser = this.service.usuarioToLogIn.id;
    this.itinerario.generationEnded = false;
    console.log(this.itinerario.generationEnded);
    this.service.itinerarioSelected = this.itinerario;
    this.service.generateItinerarioData(this.itinerario, this).then((res:HttpResponse<Itinerario>) => {
      this.service.itinerarioSelected = res.body
      this.service.refreshToken();
    }).catch(error => {
      this.service.loading = false;
      console.log(error);
      alert('Está tardando demasiado, por favor espera unos minutos y podrás encontrarlo en itinerarios propios. Si no aparece, inténtalo de nuevo más adelante. Disculpa las molestias.' );
    })

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
