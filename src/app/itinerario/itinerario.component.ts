import {Component, Input, OnInit} from '@angular/core';
import {Itinerario} from "../folder/bos/Itinerario";
import {ModalController} from "@ionic/angular";

@Component({
  selector: 'app-itinerario',
  templateUrl: './itinerario.component.html',
  styleUrls: ['./itinerario.component.scss'],
})
export class ItinerarioComponent implements OnInit {

  @Input() itinerario: Itinerario;

  constructor(public modalController: ModalController) { }

  ngOnInit() {}

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      'dismissed': true
    });
  }


}
