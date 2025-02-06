import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-gestion-infraestructura',
  templateUrl: './gestion-infraestructura.component.html',
  styleUrls: ['./gestion-infraestructura.component.css']
})
export class GestionInfraestructuraComponent {
  constructor(private location: Location){}

  goBack(): void {
    this.location.back();
  }
}
