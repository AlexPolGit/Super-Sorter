import { Injectable } from "@angular/core";
import { CookieService } from "ngx-cookie-service";
import { HOST_NAME } from "./web-service";

@Injectable({providedIn:'root'})
export class UserCookieService {
    constructor(private cookies: CookieService) {}

    getCookie(name: string): string {
        return this.cookies.get(name);
    }

    setCookie(name: string, value: string) {
        this.cookies.set(name, value, undefined, "/", HOST_NAME);
    }

    deleteCookie(name: string) {
        this.cookies.delete(name, "/", HOST_NAME);
    }

    /////////////////////////////////////////////////////////////////////

    getCurrentUser(): [string, string] {
        return [this.getCookie("username"), this.getCookie("password")];
    }

    setCurrentUser(username: string, password: string) {
        this.setCookie("username", username);
        this.setCookie("password", password);
    }

    logoutUser() {
        this.deleteCookie("username");
        this.deleteCookie("password");
    }
}