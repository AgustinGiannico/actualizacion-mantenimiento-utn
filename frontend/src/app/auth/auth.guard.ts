import { inject } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { EnviarDatosService } from '../auth/enviar-datos.service';

export const authGuard = (): boolean | UrlTree => {
  const enviarDatosService = inject(EnviarDatosService);
  const router = inject(Router);

  if (enviarDatosService.isAuthenticated()) {
    return true;
  } else {
    return router.parseUrl('/login');
  }
};