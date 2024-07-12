import { Component, Inject, LOCALE_ID } from '@angular/core';
import { Router } from '@angular/router';
import { AccountsService } from '../_services/accounts-service';
import { UserPreferenceService } from '../_services/user-preferences-service';
import { environment } from 'src/environment/environment';

@Component({
  selector: 'app-top-page',
  templateUrl: './top-page.component.html',
  styleUrl: './top-page.component.scss'
})
export class TopPageComponent {
    constructor(
        private router: Router,
        private accountsService: AccountsService,
        private userPreferenceService: UserPreferenceService,
        @Inject(LOCALE_ID) public activeLocale: string
    ) {
        if (!this.accountsService.isLoggedIn()) {
            this.router.navigate(["/login"]);
        }

        if (environment.isProd) {
            let currentLocale = this.userPreferenceService.getSiteLanguage();
            if (activeLocale !== currentLocale) {
                window.location.href = `/${currentLocale}${this.router.url}`;
            }
        }
    }
}
