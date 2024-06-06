import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WebService } from '../_services/web-service';
import { UserCookieService } from '../_services/user-cookie-service';

@Component({
  selector: 'app-top-page',
  templateUrl: './top-page.component.html',
  styleUrl: './top-page.component.scss'
})
export class TopPageComponent {

    language: string = "en";

    constructor(private router: Router, private activatedRoute: ActivatedRoute, private webService: WebService, private cookies: UserCookieService) {
        if (!this.webService.isLoggedIn()) {
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
        this.webService.logout();
    }

    username(): string {
        return this.cookies.getCurrentUser()[0];
    }

    changeLanguage(lang: string) {
        this.router.navigate([], {
            relativeTo: this.activatedRoute,
            queryParams: { language: lang }, 
            queryParamsHandling: 'merge'
        });
    }

    gotoDocs() {
        window.open(this.webService.SERVER_URL, "_blank");
    }
}
