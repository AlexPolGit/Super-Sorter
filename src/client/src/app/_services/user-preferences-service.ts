import { Injectable } from "@angular/core";
import { UserCookieService } from "./user-cookie-service";

@Injectable({providedIn:'root'})
export class UserPreferenceService {

    constructor(private cookies: UserCookieService) {}

    setSiteLanguage(languageCode: string) {
        this.cookies.setCookie("site-language", languageCode);
        console.log(`Set user language preference to [${languageCode}]`);
    }

    getSiteLanguage() {
        return this.cookies.getCookie("site-language");
    }

    setAnilistLanguage(language: "romaji" | "english" | "native") {
        this.cookies.setCookie("anilist-language", language);
        console.log(`Set user Anilist language preference to [${language}]`);
    }

    getAnilistLanguage() {
        return this.cookies.getCookie("anilist-language");
    }
}
