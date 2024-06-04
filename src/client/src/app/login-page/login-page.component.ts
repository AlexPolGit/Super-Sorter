import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { WebService } from '../_services/web-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {
    usernameFormControl = new FormControl('', [ Validators.required ]);
    passwordFormControl = new FormControl('', [ Validators.required ]);

    constructor(private router: Router, private webService: WebService) {}

    canLogin(): boolean {
        return (!this.usernameFormControl.hasError('required') && !this.passwordFormControl.hasError('required'));
    }

    login() {
        if (!this.usernameFormControl.value) {
            throw new Error(`Missing username!`);
        }
        if (!this.passwordFormControl.value) {
            throw new Error(`Missing password!`);
        }

        this.webService.login(this.usernameFormControl.value, this.passwordFormControl.value).then((success: boolean) => {
            if (success) {
                this.router.navigate(['/']);
            }
        });
    }

    register() {
        if (!this.usernameFormControl.value) {
            throw new Error(`Missing username!`);
        }
        if (!this.passwordFormControl.value) {
            throw new Error(`Missing password!`);
        }

        this.webService.register(this.usernameFormControl.value, this.passwordFormControl.value).then((success: boolean) => {
            if (success) {
                this.login();
            }
        });
    }
}
