import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { AuthService } from './core/services/auth.service';
import { Router }               from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent {
  @ViewChild('sidenav', { static: true }) sidenav!: MatSidenav;
  title = 'touchConsulting';

  constructor(private auth: AuthService, private router: Router) {}

  logout() {
    this.auth.logout();
    this.sidenav.close();
    this.router.navigate(['/login']);
  }
}
