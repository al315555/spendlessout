import {Component, Input, OnInit} from '@angular/core';
import {Itinerario} from "../folder/bos/Itinerario";
import {ModalController} from "@ionic/angular";
import {AuthService} from "../auth.service";
import {HttpResponse} from "@angular/common/http";
import {Actividad} from "../folder/bos/Actividad";

@Component({
    selector: 'app-itinerario',
    templateUrl: './itinerario.component.html',
    styleUrls: ['./itinerario.component.scss'],
})
export class ItinerarioComponent implements OnInit {

    @Input() itinerario: Itinerario;

    actividades: Actividad[] = [];

    public DEMO_URL = 'https://www.eventbrite.es/e/entradas-abono-x-festival-early-music-morella-148337646895?aff=ebdssbdestsearch';

    constructor(public modalController: ModalController, public service: AuthService) {
    }

    ngOnInit() {
        this.loadActividades();
    }

    loadActividades() {
        this.itinerario = this.service.itinerarioSelected;
        this.service.getActivitiesFromItinerario(this.itinerario.id).subscribe((res: HttpResponse<Array<Actividad>>) => {
            let arrayActividades = res.body;
            for (let act of arrayActividades) {
                this.actividades.push(act);
            }
            this.service.loading = false;
        });
    }

    dismiss() {
        // using the injected ModalController this page
        // can "dismiss" itself and optionally pass back data
        this.modalController.dismiss({
            'dismissed': true
        });
    }

    formatRangeDate(dateFromMilliseconds: number): string {
        if(dateFromMilliseconds === 0){
            return ''
        }
        let date = new Date();
        date.setTime(dateFromMilliseconds);
        return date.getUTCDate().toString().padStart(2, "0") + '/' + date.getUTCMonth().toString().padStart(2, "0") +
            '/' + date.getFullYear() + ' ' +
            date.getUTCHours().toString().padStart(2, "0") + ':' + date.getUTCMinutes().toString().padStart(2, "0");
    }

    formatDate(dateMilliseconds: number): string {
        const millisecsDiffer = new Date().getTime() - dateMilliseconds;
        const secsDiffer = millisecsDiffer / 1000;
        const minsDiffer = secsDiffer / 60;
        if (minsDiffer < 1) {
            return 'hace ' + secsDiffer.toFixed(0) + ' segundos';
        }
        const hoursDiffer = minsDiffer / 60;
        if (hoursDiffer < 1) {
            return 'hace ' + minsDiffer.toFixed(0) + ' minuto(s)';
        }
        const daysDiffer = hoursDiffer / 24;
        if (daysDiffer < 1) {
            return 'hace ' + hoursDiffer.toFixed(0) + ' hora(s)';
        }
        const weeksDiffer = daysDiffer / 7;
        if (weeksDiffer < 1) {
            return 'hace ' + daysDiffer.toFixed(0) + ' día(s)';
        }
        return 'hace ' + weeksDiffer.toFixed(0) + ' semana(s)';
    }


    redirectToMoreInfo(url: string) {
        window.open(url, '_system');
        //"https://www.eventbrite.es/e/entradas-abono-x-festival-early-music-morella-148337646895?aff=ebdssbdestsearch", '_system');
    }
}
