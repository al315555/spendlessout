import {Component, OnInit} from '@angular/core';
import {Town} from "../bos/Town";
import {AuthService} from "../../auth.service";
import {Itinerario} from "../bos/Itinerario";
import { ModalController } from '@ionic/angular';
import {ItinerarioComponent} from "../../itinerario/itinerario.component";
import {HttpResponse} from "@angular/common/http";

@Component({
  selector: 'app-itinerarios',
  templateUrl: './itinerarios.component.html',
  styleUrls: ['./itinerarios.component.scss'],
})
export class ItinerariosComponent implements OnInit {

  isItemAvailable = false;
  valueFromSearchBar = '';
  items: Town[] = [];
  itemTownSelected: Town = new Town();
  isItemTownSelected: boolean = false;

  itinerarios: Itinerario[];

  asc: boolean = true;

  constructor(public service: AuthService, public modalController: ModalController) {
  }

  orderButtonClicked($event){
    this.asc = !this.asc;
    this.service.loading = true;
    if(this.itemTownSelected) {
      this.isItemTownSelected = true;
      this.itinerarios = [];
      this.service.getFilteredItinerarios(this.itemTownSelected, this.asc).subscribe((res: HttpResponse<Array<Itinerario>>) => {
        let arrayIti = res.body;
        for (let iti of arrayIti) {
          this.itinerarios.push(iti);
        }
        this.service.loading = false;
      });
    }
  }

  get townSelectedName() {
    return this.itemTownSelected ? this.itemTownSelected.name : '';
  }

  ngOnInit() {
    this.itinerarios = [];
  }

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
      this.service.loading = false;
      if(this.itemTownSelected){
        this.isItemTownSelected = true;
        this.itinerarios = [];
        this.service.getFilteredItinerarios(this.itemTownSelected, this.asc).subscribe((res:HttpResponse<Array<Itinerario>>) => {
          let arrayIti = res.body;
          for (let iti of arrayIti) {
            this.itinerarios.push(iti);
          }
          this.service.loading = false;
        });
      }else{
        this.isItemTownSelected = false;
        alert('Ubicación desconocida, seleccione otra población.');
      }
      console.log(this.itemTownSelected);
    }, error => {
      this.isItemAvailable = false;
      this.service.loading = false;
      this.isItemTownSelected = false;
      console.error(error);
      alert('Ubicación desconocida, seleccione otra población.');
    });
  }

  async presentItinerarioModal(i: number) {
    this.service.itinerarioSelected = this.itinerarios[i];
    const modal = await this.modalController.create({
      component: ItinerarioComponent,
      componentProps: {itinerario: this.itinerarios[i]}
    });
    return await modal.present();
  }
}
