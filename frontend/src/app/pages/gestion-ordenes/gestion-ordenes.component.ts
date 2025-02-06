import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-gestion-ordenes',
  templateUrl: './gestion-ordenes.component.html',
  styleUrls: ['./gestion-ordenes.component.css']
})
export class GestionOrdenesComponent {
  constructor(private location: Location) {}

  goBack(): void {
    this.location.back();
  }
}
