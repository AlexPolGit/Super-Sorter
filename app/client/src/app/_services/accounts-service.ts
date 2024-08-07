import { Injectable } from "@angular/core";
import { WebService } from "./web-service";
import { UserCookieService } from "./user-cookie-service";
import { Router } from "@angular/router";
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
        this.webService.setUsernameAndPasswordHeaders();
    }

    logoutUser() {
        this.cookies.deleteCookie("username");
        this.cookies.deleteCookie("password");
        this.cookies.deleteCookie("googleName");
    }

    async login(username: string, password: string, googleName?: string): Promise<boolean> {
        let login = await this.webService.procedure<{username: string}>(this.webService.server.user.login.query({
            username: username.startsWith("google:") ? username.split(":")[1] : username,
            password: password
        }),
            [
                {
                    code: 401,
                    doAction: (error?: Error) => {
                        throw new UserError(
                            $localize`:@@accounts-user-wrong-password-desc:Password for user "${username}:username:" was incorrect.`,
                            $localize`:@@accounts-user-wrong-password-title:Incorrect Password`,
                            401,
                            error
                        );
                    }
                },
                {
                    code: 404,
                    doAction: (error?: Error) => {
                        throw new UserError(
                            $localize`:@@accounts-user-user-not-found-desc:Could not find a user with the name "${username}:username:".`,
                            $localize`:@@accounts-user-user-not-found-title:User Does Not Exist`,
                            404,
                            error
                        );
                    }
                }
            ]
        );

        console.log(`Successfully logged in as "${login.username}".`);
        this.setCurrentUser(username, password, googleName);
        return true;
    }

    async register(username: string, password: string): Promise<boolean> {

        let register = await this.webService.procedure<{username: string}>(this.webService.server.user.register.mutate({
            username: username,
            password: password
        }),
            [
                {
                    code: 400,
                    doAction: (error?: Error) => {
                        console.warn(error);
                        if (error) {
                            if (error.message === "UsernameInvalidException") {
                                throw new UserError(
                                    $localize`:@@accounts-invalid-username-desc:Username contains invalid characters.`,
                                    $localize`:@@accounts-invalid-username-title:Invalid Username`,
                                    400
                                );
                            }
                            else if (error.message === "") {
                                throw new UserError(
                                    $localize`:@@accounts-invalid-password-desc:Password contains invalid characters.`,
                                    $localize`:@@accounts-invalid-password-title:Invalid Password`,
                                    400
                                );
                            }
                            else {
                                throw error;
                            }
                        }
                        throw new UserError(
                            $localize`:@@accounts-user-wrong-password-desc:Password for user "${username}:username:" was incorrect.`,
                            $localize`:@@accounts-user-wrong-password-title:Incorrect Password`,
                            401,
                            error
                        );
                    }
                },
                {
                    code: 409,
                    doAction: (error?: Error) => {
                        throw new UserError(
                            $localize`:@@accounts-user-already-exists-desc:A user with the name "${username}:username:" already exists. Please pick a different name.`,
                            $localize`:@@accounts-user-already-exists-title:User Already Exists`,
                            409,
                            error
                        );
                    }
                }
            ]
        );
        console.log(`Successfully created account "${register.username}".`);
        this.setCurrentUser(username, password);
        return true;
    }

    tryLogin() {
        if (!this.isLoggedIn()) {
            this.router.navigate(["/login"]);
        }
        else {
            this.webService.setUsernameAndPasswordHeaders();
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
