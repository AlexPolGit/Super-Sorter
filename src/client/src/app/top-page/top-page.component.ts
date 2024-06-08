import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountsService } from '../_services/accounts-service';
import { UserCookieService } from '../_services/user-cookie-service';
import { DOCS_URL } from '../_services/web-service';

@Component({
  selector: 'app-top-page',
  templateUrl: './top-page.component.html',
  styleUrl: './top-page.component.scss'
})
export class TopPageComponent {

    language: string = "en";

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private accountsService: AccountsService,
        private cookies: UserCookieService
    ) {
        if (!this.accountsService.isLoggedIn()) {
            this.router.navigate(["/login"]);
        }

        this.activatedRoute.queryParams.subscribe((params: any) => {
            this.language = params.language ? params.language : "en";
        });
    }
    
    goHome() {
        this.router.navigate(['/']);
    }

    logout() {
        this.accountsService.logout();
    }

    username(): string {
        return this.cookies.getCurrentUser()[0];
    }

    gotoDocs() {
        window.open(DOCS_URL, "_blank");
    }
}
