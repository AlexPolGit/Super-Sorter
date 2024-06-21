import { Component } from '@angular/core';
import { environment } from 'src/environment/environment';
import { ThemeService } from './_services/theme-service';

export interface BaseParameters {}

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    providers: [ ]
})
export class AppComponent {
    constructor(private themeService: ThemeService) {
        if (window && environment.isProd) {
            window.console.log = () => {};
        }
    }
}
