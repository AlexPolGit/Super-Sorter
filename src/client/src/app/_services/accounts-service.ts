import { firstValueFrom } from "rxjs";
import { Injectable } from "@angular/core";
import { WebService } from "./web-service";
import { UserCookieService } from "./user-cookie-service";
import { Router } from "@angular/router";
import { SuccessfulLoginOrRegister } from "../_objects/server/accounts";
import { LoggerService } from "./logger-service";

@Injectable({providedIn:'root'})
export class AccountsService {

    constructor(
        private logger: LoggerService,
        private webService: WebService,
        private cookies: UserCookieService,
        private router: Router
    ) {}
    
    async checkLogin(): Promise<boolean> {
        let creds = this.cookies.getCurrentUser();
        let username = creds[0];
        let password = creds[1];
        let login = firstValueFrom(this.webService.postRequest<SuccessfulLoginOrRegister>(`account/login`, {
            username: username,
            password: password
        }));

        try {
            await login;
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
        this.logger.info(`Successfully logged in as "${response.username}".`);
        this.cookies.setCurrentUser(username, password);
        return true;
    }

    async register(username: string, password: string): Promise<boolean> {
        let register = firstValueFrom(this.webService.postRequest<SuccessfulLoginOrRegister>(`account/register`, {
            username: username,
            password: password
        }));

        let response = await register;
        this.logger.info(`Successfully created account "${response.username}".`);
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
