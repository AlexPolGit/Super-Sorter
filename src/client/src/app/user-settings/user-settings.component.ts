import { Component, Inject, LOCALE_ID } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { UserPreferenceService } from '../_services/user-preferences-service';
import { Router } from '@angular/router';
import { ThemeService } from '../_services/theme-service';

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
    siteTheme: string;
    siteLanguage: string;
    audioPreviewVolume: number;

    constructor(
        private dialogRef: MatDialogRef<UserSettingsComponent>,
        private userPreferenceService: UserPreferenceService,
        private themeService: ThemeService,
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

        let siteTheme = this.userPreferenceService.getSiteTheme();
        if (siteTheme === "") {
            this.siteTheme = "light";
            this.userPreferenceService.setSiteTheme("light");
        }
        else {
            this.siteTheme = siteTheme;
        }

        let anilistLanguage = this.userPreferenceService.getAnilistLanguage();
        if (anilistLanguage === "") {
            this.anilistLanguage = "romaji";
            this.userPreferenceService.setAnilistLanguage("romaji");
        }
        else {
            this.anilistLanguage = anilistLanguage;
        }

        this.audioPreviewVolume = this.userPreferenceService.getAudioPreviewVolume();
    }

    changeLocale(event: any) {
        this.userPreferenceService.setSiteLanguage(event.value);
        this.activeLocale = event.value;
        window.location.href = `/${event.value}${this.router.url}`;
    }

    changeTheme(event: any) {
        this.themeService.changeTheme(event.value);
    }

    pickAnilistLanguage(event: any) {
        this.userPreferenceService.setAnilistLanguage(event.value);
    }

    changeDefaultAudioPreviewVolume(event: any) {
        this.userPreferenceService.setAudioPreviewVolume(event);
    }
}
