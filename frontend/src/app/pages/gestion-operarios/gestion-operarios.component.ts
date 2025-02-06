import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-gestion-operarios',
  templateUrl: './gestion-operarios.component.html',
  styleUrls: ['./gestion-operarios.component.css']
})
export class GestionOperariosComponent {
  constructor(
    private location: Location
  ) {}

  goBack(): void {
    this.location.back();
  }
}
