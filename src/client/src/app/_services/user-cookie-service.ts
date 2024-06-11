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
        this.cookies.set(name, value, 1000, "/", HOST_NAME);
    }

    deleteCookie(name: string) {
        this.cookies.delete(name, "/", HOST_NAME);
    }
}
