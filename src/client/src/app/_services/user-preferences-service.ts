import { Injectable } from "@angular/core";
import { UserCookieService } from "./user-cookie-service";

@Injectable({providedIn:'root'})
export class UserPreferenceService {

    constructor(private cookies: UserCookieService) {}

    setSiteLanguage(languageCode: string) {
        this.cookies.setCookie("site-language", languageCode);
        console.log(`Set user language preference to [${languageCode}]`);
    }

    getSiteLanguage(): string {
        let language = this.cookies.getCookie("site-language");
        if (language === "") {
            language = "en-US";
            this.setSiteLanguage("en-US");
        }
        return language;
    }

    setSiteTheme(theme: "light" | "dark") {
        this.cookies.setCookie("site-theme", theme);
        console.log(`Set user site theme preference to [${theme}]`);
    }

    getSiteTheme(): string {
        return this.cookies.getCookie("site-theme");
    }

    setAnilistLanguage(language: "romaji" | "english" | "native") {
        this.cookies.setCookie("anilist-language", language);
        console.log(`Set user Anilist language preference to [${language}]`);
    }

    getAnilistLanguage(): string {
        return this.cookies.getCookie("anilist-language");
    }

    setAudioPreviewVolume(volume: number) {
        this.cookies.setCookie("audio-preview-volume", volume.toString());
        console.log(`Set user audio preview volume to [${volume.toString()}]`);
    }

    getAudioPreviewVolume(): number {
        let value = this.cookies.getCookie("audio-preview-volume");
        return value === "" ? 5 : parseFloat(value);
    }
}
