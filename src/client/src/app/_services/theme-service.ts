import { Inject, Injectable } from "@angular/core";
import { UserPreferenceService } from "./user-preferences-service";
import { DOCUMENT } from "@angular/common";

@Injectable({providedIn:'root'})
export class ThemeService {

    constructor(@Inject(DOCUMENT) private document: Document, private userPreferenceService: UserPreferenceService) {
        this.setTheme();
    }

    setTheme() {
        const theme = this.userPreferenceService.getSiteTheme();
        let themeLink = this.document.getElementById('app-theme') as HTMLLinkElement;

        if (theme === 'dark') {
            themeLink.href = 'theme-dark.css';
        }
        else {
            themeLink.href = 'theme-light.css';
        }
    }

    changeTheme(theme: "light" | "dark") {
        this.userPreferenceService.setSiteTheme(theme);
        this.setTheme();
    }
}
