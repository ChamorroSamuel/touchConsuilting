import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { AuthService } from './core/services/auth.service';
import { Router }               from '@angular/router';
import { NotificationService }  from './core/services/notification.service';
import { Notification }         from './core/models/notification.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent {
  @ViewChild('sidenav', { static: true }) sidenav!: MatSidenav;
  title = 'touchConsulting';

  notifications: Notification[] = [];
  showDropdown = false;
  userRole: string | null;

  constructor(
    private auth: AuthService,
    private router: Router,
    private notifSvc: NotificationService
  ) {
    const u = this.auth.getUser();
    this.userRole = u?.role ?? null;
  }

  ngOnInit(): void {
    if (this.userRole === 'Administrador') {
      this.loadNotifications();
      setInterval(() => this.loadNotifications(), 60000);
    }
  }

  loadNotifications() {
    this.notifSvc.getAll().subscribe(list => {
      this.notifications = list;
    });
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  logout() {
    this.auth.logout();
    this.sidenav.close();
    this.router.navigate(['/login']);
  }
}
