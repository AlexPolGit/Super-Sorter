import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AccountsService, CurrentUser } from '../_services/accounts-service';
import { DOCS_URL, WebService } from '../_services/web-service';
import { MatDialog } from '@angular/material/dialog';
import { UserSettingsComponent } from '../user-settings/user-settings.component';

export const USER_SETTINGS_MODAL_HEIGHT = "80%";
export const USER_SETTINGS_MODAL_WIDTH = "90%";

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.scss'
})
export class TopBarComponent {

    @Input() showHomeButton: boolean = true;
    @Input() showUsername: boolean = true;
    @Input() showLogoutButton: boolean = true;

    constructor(
        private router: Router,
        private accountsService: AccountsService,
        public dialog: MatDialog,
        private webService: WebService
    ) {
        
    }
    
    goHome() {
        this.router.navigate(['/']);
    }

    logout() {
        this.accountsService.logout();
    }

    isGoogle(): boolean {
        return this.accountsService.getCurrentUser()?.isGoogle ? true : false;
    }

    username(): string {
        let user = this.accountsService.getCurrentUser();

        if (user && user.isGoogle) {
            return user.googleName.trim();
        }
        else if (user && !user.isGoogle) {
            return user.username.trim();
        }
        else {
            return "";
        }
    }

    gotoDocs() {
        window.open(DOCS_URL, "_blank");
    }

    gotoGithub() {
        window.open("https://github.com/AlexPolGit/Super-Sorter", "_blank");
    }

    openUserSettings() {
        const dialogRef = this.dialog.open(UserSettingsComponent, {
            data: null,
            height: USER_SETTINGS_MODAL_HEIGHT,
            width: USER_SETTINGS_MODAL_WIDTH
        });

        dialogRef.afterClosed().subscribe((result: any | undefined) => {});
    }
}
