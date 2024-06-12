import { Component, Inject, LOCALE_ID } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { UserPreferenceService } from '../_services/user-preferences-service';
import { Router } from '@angular/router';

interface Locale {
    code: string,
    name: string
}

@Component({
    selector: 'app-user-settings',
    templateUrl: './user-settings.component.html',
    styleUrl: './user-settings.component.scss'
})
export class UserSettingsComponent {

    locales: Locale[] = [
        { code: "en-US", name: "English" },
        { code: "ja", name: "日本語" }
    ];

    anilistLanguage: string;
    siteLanguage: string;

    constructor(
        private dialogRef: MatDialogRef<UserSettingsComponent>,
        private userPreferenceService: UserPreferenceService,
        @Inject(LOCALE_ID) public activeLocale: string, 
        private router: Router
    ) {
        let siteLanguage = this.userPreferenceService.getSiteLanguage();
        if (siteLanguage === "") {
            this.siteLanguage = "en-US";
            this.userPreferenceService.setSiteLanguage("en-US");
        }
        else {
            this.siteLanguage = siteLanguage;
        }

        let anilistLanguage = this.userPreferenceService.getAnilistLanguage();
        if (anilistLanguage === "") {
            this.anilistLanguage = "romaji";
            this.userPreferenceService.setAnilistLanguage("romaji");
        }
        else {
            this.anilistLanguage = anilistLanguage;
        }
    }

    pickAnilistLanguage(event: any) {
        this.userPreferenceService.setAnilistLanguage(event.value);
    }

    changeLocale(event: any) {
        this.userPreferenceService.setSiteLanguage(event.value);
        this.activeLocale = event.value;
        window.location.href = `/${event.value}${this.router.url}`;
    }
}
