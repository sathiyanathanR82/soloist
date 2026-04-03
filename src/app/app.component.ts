import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Soloist';

  constructor(public router: Router) {}

  showNavbar(): boolean {
    const hiddenRoutes = ['/', '/login'];
    return !hiddenRoutes.includes(this.router.url);
  }
}
