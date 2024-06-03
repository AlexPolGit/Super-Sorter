import { Component } from '@angular/core';
import { WebService } from './_services/web-service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [ WebService ]
})
export class AppComponent {
    constructor(private webService: WebService, private cookies: CookieService) {
        this.cookies.set("TEST", JSON.stringify({idk: 123}));
    }
}