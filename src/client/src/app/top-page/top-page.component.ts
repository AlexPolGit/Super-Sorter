import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { WebService } from '../_services/web-service';

@Component({
  selector: 'app-top-page',
  templateUrl: './top-page.component.html',
  styleUrl: './top-page.component.scss'
})
export class TopPageComponent {

    constructor(private router: Router, private webService: WebService) {
        this.webService.checkLogin();
    }
    
    goHome() {
        this.router.navigate(['/']);
    }

    logout() {
        this.webService.logout();
    }

    username(): string {
        return this.webService.getCurrentUsername();
    }
}
