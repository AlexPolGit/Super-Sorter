import { Component, HostListener } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AccountsService } from '../_services/accounts-service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserError } from '../_objects/custom-error';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {
    usernameFormControl = new FormControl('', [ Validators.required ]);
    passwordFormControl = new FormControl('', [ Validators.required ]);

    constructor(private router: Router, private accountsService: AccountsService, private _snackBar: MatSnackBar) {}

    @HostListener('window:keyup', ['$event'])
    keyEvent(event: KeyboardEvent) {
        if (event.key == "Enter") {
            this.login();
        }
    }

    canLogin(): boolean {
        return (!this.usernameFormControl.hasError('required') && !this.passwordFormControl.hasError('required'));
    }

    login() {
        this.checkTextFields();

        this.accountsService.login(this.usernameFormControl.value as string, this.passwordFormControl.value as string).then((succ: boolean) => {
            if (succ) {
                this.router.navigate(['/']);
            }
        });
    }

    register() {
        this.checkTextFields();

        this.accountsService.register(this.usernameFormControl.value as string, this.passwordFormControl.value as string).then((succ: boolean) => {
            if (succ) {
                this.login();
            }
        });
    }

    checkTextFields() {
        if (!this.usernameFormControl.value) {
            throw new UserError(`Please enter a username.`, `Missing username!`);
        }
        if (!this.passwordFormControl.value) {
            throw new UserError(`Please enter a password.`, `Missing password!`);
        }
    }

    openSnackBar(message: string) {
        this._snackBar.open(message, undefined, {
            duration: 3000
        });
    }
}
