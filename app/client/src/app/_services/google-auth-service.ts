import { SocialAuthService, SocialUser } from "@abacritt/angularx-social-login";
import { Injectable } from "@angular/core";
import { WebService } from "./web-service";
import { AccountsService } from "./accounts-service";
import { GoogleLogin } from "../_objects/server/accounts";
import { Router } from "@angular/router";

@Injectable({providedIn:'root'})
export class GoogleAuthService {
    user!: SocialUser;
    loggedIn!: boolean;

    constructor(
        private webService: WebService,
        private authService: SocialAuthService,
        private accountsService: AccountsService,
        private router: Router
    ) {
        this.authService.authState.subscribe((user) => {
            console.log("Signed in with Google:", user);
            this.user = user;
            this.loggedIn = (user != null);

            this.webService.server.user.googleLogin.query({ token: this.user.idToken }).then((login: GoogleLogin) => {
                this.accountsService.login(`google:${this.user.id}`, login.sessionSecret, this.user.name).then((succ: boolean) => {
                    if (succ) {
                        this.router.navigate(['/']);
                    }
                });
            });
        });
    }

    signOut(): void {
        this.accountsService.logout();
        this.authService.signOut();
    }
}