import { Component } from '@angular/core';
import { environment } from 'src/environment/environment';

export interface BaseParameters {}

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    providers: [ ]
})
export class AppComponent {
    constructor() {
        if (window && environment.isProd) {
            window.console.log = () => {};
        }
    }
}
