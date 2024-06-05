import { Component } from '@angular/core';
import { WebService } from './_services/web-service';

export interface BaseParameters {
    language: string
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [ WebService ]
})
export class AppComponent {
    constructor() {}
}
