import { Component } from '@angular/core';

export interface BaseParameters {
    language: string
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [ ]
})
export class AppComponent {
    constructor() {}
}
