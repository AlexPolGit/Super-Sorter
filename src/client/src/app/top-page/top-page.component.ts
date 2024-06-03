import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-top-page',
  templateUrl: './top-page.component.html',
  styleUrl: './top-page.component.scss'
})
export class TopPageComponent {

    constructor(private router: Router) {}
    
    goHome() {
        this.router.navigate(['/']);
    }
}
