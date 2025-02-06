import { Component, Input } from '@angular/core';
import { LogoutService } from '../../services/logout.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  @Input() isLoginRoute: boolean = false;

  constructor(
    private router: Router,
    private logoutService: LogoutService
  ) {}

  cerrarSesion() {
    this.logoutService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error("Error al cerrar sesión", error);
      }
    });
  }
}
