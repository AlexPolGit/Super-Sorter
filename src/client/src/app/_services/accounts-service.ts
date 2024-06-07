import { firstValueFrom } from "rxjs";
import { Injectable } from "@angular/core";
import { WebService } from "./web-service";
import { UserCookieService } from "./user-cookie-service";
import { Router } from "@angular/router";
import { SuccessfulLoginOrRegister } from "../_objects/server/accounts";

@Injectable({providedIn:'root'})
export class AccountsService {

    constructor(private webService: WebService, private cookies: UserCookieService, private router: Router) {}
    
    async checkLogin(): Promise<boolean> {
        let creds = this.cookies.getCurrentUser();
        let username = creds[0];
        let password = creds[1];
        let login = firstValueFrom(this.webService.postRequest<SuccessfulLoginOrRegister>(`account/login`, {
            username: username,
            password: password
        }));

        try {
            let response = await login;
            // console.log(`Successfully logged in as "${response.username}".`)
            return true;
        }
        catch (error) {
            this.router.navigate(['/login']);
            return false;
        }
    }

    async login(username: string, password: string): Promise<boolean> {
        let login = firstValueFrom(this.webService.postRequest<SuccessfulLoginOrRegister>(`account/login`, {
            username: username,
            password: password
        }));

        let response = await login;
        console.log(`Successfully logged in as "${response.username}".`);
        this.cookies.setCurrentUser(username, password);
        return true;
    }

    async register(username: string, password: string): Promise<boolean> {
        let register = firstValueFrom(this.webService.postRequest<SuccessfulLoginOrRegister>(`account/register`, {
            username: username,
            password: password
        }));

        let response = await register;
        console.log(`Successfully created account "${response.username}".`);
        this.cookies.setCurrentUser(username, password);
        return true;
    }

    isLoggedIn(): boolean {
        let creds = this.cookies.getCurrentUser();
        return creds[0].length > 0 && creds[1].length > 0;
    }

    logout() {
        this.cookies.logoutUser();
        this.router.navigate(['/login']);
    }
}
