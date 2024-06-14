import { Component, HostListener } from '@angular/core';
import { AbstractControl, FormControl, ValidationErrors, Validators } from '@angular/forms';
import { AccountsService } from '../_services/accounts-service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserError } from '../_objects/custom-error';
import { GoogleAuthService } from '../_services/google-auth-service';

export const IS_NUMERIC = "^[0-9]+$"

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {
    usernameFormControl = new FormControl('', [ this.validateUsername ]);
    passwordFormControl = new FormControl('', [ this.validatePassword ]);

    constructor(
        private router: Router,
        private accountsService: AccountsService,
        private googleAuthService: GoogleAuthService,
        private _snackBar: MatSnackBar
    ) {}

    @HostListener('window:keyup', ['$event'])
    keyEvent(event: KeyboardEvent) {
        if (event.key == "Enter" && this.canLogin()) {
            this.login();
        }
    }

    canLogin(): boolean {
        return this.usernameFormControl.valid && this.passwordFormControl.valid;
    }

    login() {
        this.accountsService.login(this.usernameFormControl.value as string, this.passwordFormControl.value as string).then((succ: boolean) => {
            if (succ) {
                this.router.navigate(['/']);
            }
        });
    }

    register() {
        this.accountsService.register(this.usernameFormControl.value as string, this.passwordFormControl.value as string).then((succ: boolean) => {
            if (succ) {
                this.login();
            }
        });
    }

    openSnackBar(message: string) {
        this._snackBar.open(message, undefined, {
            duration: 3000
        });
    }

    validateUsername(ctrl: AbstractControl): ValidationErrors | null {
        let val = (ctrl.value as string).trim();
        let numericMatch = val.match(IS_NUMERIC);

        if (val.length === 0) {
            return {
                required: true
            }
        }
        if (val.length > 30) {
            return {
                maxlength: true
            }
        }
        else if (numericMatch) {;
            return {
                numeric: true
            }
        }
        else {
            return null;
        }
    }

    validatePassword(ctrl: AbstractControl): ValidationErrors | null {
        let val = (ctrl.value as string);

        if (val.length === 0) {
            return {
                required: true
            }
        }
        if (val.length > 30) {
            return {
                maxlength: true
            }
        }
        else {
            return null;
        }
    }
}
