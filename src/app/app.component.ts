import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { AuthService } from './core/services/auth.service';
import {NavigationEnd, Router} from '@angular/router';
import { NotificationService }  from './core/services/notification.service';
import { Notification }         from './core/models/notification.model';
import {filter} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent {
  @ViewChild('sidenav', { static: false }) sidenav?: MatSidenav;
  title = 'touchConsulting';

  notifications: Notification[] = [];
  showDropdown = false;
  userRole: string | null;
  showMenu = false;

  constructor(
    private auth: AuthService,
    private router: Router,
    private notifSvc: NotificationService
  ) {
    const u = this.auth.getUser();
    this.userRole = u?.role ?? null;
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: NavigationEnd) => {
        const url = e.urlAfterRedirects;
        
        this.showMenu = !url.startsWith('/login');
      });
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
    this.sidenav?.close();
    this.router.navigate(['/login']);
  }
}
