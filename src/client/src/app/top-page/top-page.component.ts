import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AccountsService } from '../_services/accounts-service';

@Component({
  selector: 'app-top-page',
  templateUrl: './top-page.component.html',
  styleUrl: './top-page.component.scss'
})
export class TopPageComponent {
    constructor(
        private router: Router,
        private accountsService: AccountsService
    ) {
        if (!this.accountsService.isLoggedIn()) {
            this.router.navigate(["/login"]);
        }
    }
}
