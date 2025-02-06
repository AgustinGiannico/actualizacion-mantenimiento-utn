import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EnviarDatosService } from '../../auth/enviar-datos.service';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css']
})
export class NotFoundComponent implements OnInit {

  constructor(
    private router: Router,
    private enviarDatosService: EnviarDatosService
  ) {}

  ngOnInit(): void {

    if (!this.enviarDatosService.isAuthenticated()) {
      this.router.navigate(['/login']);
    }
  }
}
