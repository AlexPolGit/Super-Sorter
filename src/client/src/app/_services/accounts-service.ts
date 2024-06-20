import { firstValueFrom } from "rxjs";
import { Injectable } from "@angular/core";
import { WebService } from "./web-service";
import { UserCookieService } from "./user-cookie-service";
import { Router } from "@angular/router";
import { SuccessfulLoginOrRegister } from "../_objects/server/accounts";
import { UserError } from "../_objects/custom-error";

export interface CurrentUser {
    username: string;
    password: string;
    googleName: string;
    isGoogle: boolean;
}

@Injectable({providedIn:'root'})
export class AccountsService {
    constructor(
        private webService: WebService,
        private cookies: UserCookieService,
        private router: Router
    ) {}

    isGoogle(): boolean {
        return this.cookies.getCookie("username").startsWith("google:");
    }

    getCurrentUser(): CurrentUser | null {
        let localUsername = this.cookies.getCookie("username");
        let localPassword = this.cookies.getCookie("password");
        let googleName = this.cookies.getCookie("googleName");

        if (localUsername !== "" && localPassword !== "") {
            return {
                username: localUsername,
                password: localPassword,
                isGoogle: localUsername.startsWith("google:"),
                googleName: googleName
            }
        }
        else {
            return null;
        }
    }

    setCurrentUser(username: string, password: string, googleName?: string) {
        this.cookies.setCookie("username", username.trim());
        this.cookies.setCookie("password", password);
        this.cookies.setCookie("googleName", googleName ? googleName : "");
    }

    logoutUser() {
        this.cookies.deleteCookie("username");
        this.cookies.deleteCookie("password");
        this.cookies.deleteCookie("googleName");
    }
    
    async checkLogin(): Promise<boolean> {
        let user = this.getCurrentUser();
        if (user === null) {
            return false;
        }

        let login = firstValueFrom(this.webService.postRequest<SuccessfulLoginOrRegister>(`account/login`, {
            username: user.username.startsWith("google:") ? user.username.split(":")[1] : user.username,
            password: user.password
        }, false));

        try {
            await login;
            return true;
        }
        catch (error) {
            this.router.navigate(['/login']);
            return false;
        }
    }

    async login(username: string, password: string, googleName?: string): Promise<boolean> {
        let login = firstValueFrom(this.webService.postRequest<SuccessfulLoginOrRegister>(`account/login`, {
            username: username.startsWith("google:") ? username.split(":")[1] : username,
            password: password
        }, false));

        try {
            let response = await login;
            console.log(`Successfully logged in as "${response.username}".`);
            this.setCurrentUser(username, password, googleName);
            return true;
        }
        catch(ex) {
            if (ex instanceof UserError) {
                if (ex.message.includes("UserNotFoundException")) {
                    throw new UserError(
                        $localize`:@@accounts-user-user-not-found-desc:Could not find a user with the name "${username}:username:".`,
                        $localize`:@@accounts-user-user-not-found-title:User Does Not Exist`,
                        ex.status,
                        ex.statusText
                    );
                }
                else if (ex.message.includes("PasswordIncorrectException")) {
                    throw new UserError(
                        $localize`:@@accounts-user-wrong-password-desc:Password for user "${username}:username:" was incorrect.`,
                        $localize`:@@accounts-user-wrong-password-title:Incorrect Password`,
                        ex.status,
                        ex.statusText
                    );
                }
                else if (ex.message.includes("GoogleUserLoginFailedException")) {
                    throw new UserError(
                        $localize`:@@accounts-google-login-fail-desc:Could not login as a Google user.`,
                        $localize`:@@accounts-google-login-fail-title:Google Fail`,
                        ex.status,
                        ex.statusText
                    );
                }
            }
            throw ex;
        }
    }

    async register(username: string, password: string): Promise<boolean> {
        let register = firstValueFrom(this.webService.postRequest<SuccessfulLoginOrRegister>(`account/register`, {
            username: username,
            password: password
        }, false));

        try {
            let response = await register;
            console.log(`Successfully created account "${response.username}".`);
            this.setCurrentUser(username, password);
            return true;
        }
        catch(ex) {
            if (ex instanceof UserError) {
                if (ex.message.includes("UserAlreadyExistsException")) {
                    throw new UserError(
                        $localize`:@@accounts-user-already-exists-desc:A user with the name "${username}:username:" already exists. Please pick a different name.`,
                        $localize`:@@accounts-user-already-exists-title:User Already Exists`,
                        ex.status,
                        ex.statusText
                    );
                }
                else if (ex.message.includes("InvalidUsernameException")) {
                    throw new UserError(
                        $localize`:@@accounts-invalid-username-desc:Username contains invalid characters.`,
                        $localize`:@@accounts-invalid-username-title:Invalid Username`,
                        ex.status,
                        ex.statusText
                    );
                }
                else if (ex.message.includes("PasswordInvalidException")) {
                    throw new UserError(
                        $localize`:@@accounts-invalid-password-desc:Password contains invalid characters.`,
                        $localize`:@@accounts-invalid-password-title:Invalid Password`,
                        ex.status,
                        ex.statusText
                    );
                }
            }
            throw ex;
        }
    }

    isLoggedIn(): boolean {
        let user = this.getCurrentUser();
        return (user !== null);
    }

    logout() {
        this.logoutUser();
        this.router.navigate(['/login']).then(() => {
            window.location.reload();
        });
    }
}
