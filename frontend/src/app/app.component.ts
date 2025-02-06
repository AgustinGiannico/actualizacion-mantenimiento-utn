import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { EnviarDatosService } from '../app/auth/enviar-datos.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'mantenimiento-utn-front';
  showHeader: boolean = false;

  constructor(private router: Router, private enviarDatosService: EnviarDatosService) {}

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.showHeader = this.enviarDatosService.isAuthenticated();
      }
    });
  }
}
