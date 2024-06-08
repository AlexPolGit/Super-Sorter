import { CommonModule } from '@angular/common';
import { Component, Inject, LOCALE_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';

@Component({
    selector: 'app-locale-picker',
    standalone: true,
    imports: [ CommonModule, MatSelectModule, MatIconModule, FormsModule ],
    templateUrl: './locale-picker.component.html',
    styleUrl: './locale-picker.component.scss'
})
export class LocalePickerComponent {
    locales = [
        { code: "en-US", name: "English" },
        { code: "ja", name: "日本語" }
    ];

    selectedLocale: string = this.locales[0].code;

    constructor(@Inject(LOCALE_ID) public activeLocale: string) {
        this.selectedLocale = this.activeLocale;
    }

    changeLocale() {
        console.log(this.selectedLocale);
        this.activeLocale = this.selectedLocale;
        window.location.href = `/${this.selectedLocale}`;
    }
}
