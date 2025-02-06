import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { EnviarDatosService } from './enviar-datos.service';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(private enviarDatosService: EnviarDatosService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const role = this.enviarDatosService.getUserRole();
    console.log('Rol del usuario desde el guard:', role);
    if (role === 'admin') {
      console.log('Acceso concedido al administrador.');
      return true;
    }

    if (role === 'operario') {
      const allowedRoute = '/ver-mis-ordenes';

      if (state.url === allowedRoute) {
        console.log('Acceso concedido al operario para /ver-mis-ordenes.');
        return true;
      } else {
        alert('Acceso denegado. Solo puedes acceder a "ver mis ordenes"');
        console.warn('Acceso denegado al operario para ruta:', state.url);
        return false;
      }
    }

    console.warn('Acceso denegado. Rol no reconocido, redirigiendo al login.');
    this.router.navigate(['/login']);
    return false;
  }
}