import { CommonModule } from '@angular/common';
import { Component, Inject, LOCALE_ID } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Router } from '@angular/router';

interface Locale {
    code: string,
    name: string
}

@Component({
    selector: 'app-locale-picker',
    standalone: true,
    imports: [ CommonModule, MatMenuModule, MatIconModule,  MatButtonModule ],
    templateUrl: './locale-picker.component.html',
    styleUrl: './locale-picker.component.scss'
})
export class LocalePickerComponent {
    locales: Locale[] = [
        { code: "en-US", name: "English" },
        { code: "ja", name: "日本語" }
    ];

    constructor(@Inject(LOCALE_ID) public activeLocale: string, private router: Router) {}

    changeLocale(locale: Locale) {
        this.activeLocale = locale.code;
        window.location.href = `/${locale.code}${this.router.url}`;
    }
}
