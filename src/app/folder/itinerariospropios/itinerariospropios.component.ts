import {Component, OnInit} from '@angular/core';
import {Town} from "../bos/Town";
import {AuthService} from "../../auth.service";
import {Itinerario} from "../bos/Itinerario";

@Component({
  selector: 'app-itinerariospropios',
  templateUrl: './itinerariospropios.component.html',
  styleUrls: ['./itinerariospropios.component.scss'],
})
export class ItinerariospropiosComponent implements OnInit {

  isItemAvailable = false;
  valueFromSearchBar = '';
  items: Town[] = [];
  itemTownSelected: Town = new Town();
  isItemTownSelected: boolean = false;

  itinerarios: Itinerario[];

  constructor(public service: AuthService) {
  }

  get townSelectedName() {
    return this.itemTownSelected ? this.itemTownSelected.name : '';
  }

  ngOnInit() {
  }

  images = [
    'bandit',
    'batmobile',
    'blues-brothers',
    'bueller',
    'delorean',
    'eleanor',
    'general-lee',
    'ghostbusters',
    'knight-rider',
    'mirth-mobile'
  ];

  rotateImg = 0;
  get imgSrc() {
    const src = 'https://dummyimage.com/600x400/${Math.round( Math.random() * 99999)}/fff.png';
    this.rotateImg++;
    if (this.rotateImg === this.images.length) {
      this.rotateImg = 0;
    }
    return src;
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
}
