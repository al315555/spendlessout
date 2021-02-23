import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'PEC1 Tab1', url: '/folder/Tab1_PEC1', icon: 'mail' },
    { title: 'PEC1 Tab2', url: '/folder/Tab2_PEC1', icon: 'paper-plane' },
    { title: 'PEC1 Tab3', url: '/folder/Tab3_PEC1', icon: 'heart' },
    { title: 'PEC1 Tab4', url: '/folder/Tab4_PEC1', icon: 'archive' },
    { title: 'PEC1 Tab5', url: '/folder/Tab5_PEC1', icon: 'trash' },
    { title: 'PEC1 Tab6', url: '/folder/Tab6_PEC1', icon: 'warning' },
  ];
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  constructor() {}
}
