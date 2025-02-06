import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { Floor } from '../../interfaces/floor';
import { API_BASE_URL } from '../../app.config';

@Component({
  selector: 'app-floor',
  templateUrl: './floor.component.html',
  styleUrls: ['./floor.component.css'],
})
export class FloorComponent implements OnInit {
  floors: Floor[] = [];
  selectedFloor: Floor | null = null;
  floorForm: Floor = { id_floor: 0, name: '', num_tag: '', id_available: 1, available: '' };
  editMode: boolean = false;
  creatingFloor: boolean = false;
  message: string | null = null;
  messageType: 'success' | 'error' = 'success';
  private apiUrl = `${API_BASE_URL}/floor`;

  constructor(
    private apiService: ApiService<Floor>,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.getAllFloors();
  }

  goBack(): void {
    this.location.back();
  }

  getAllFloors(): void {
    this.apiService.getAll(this.apiUrl).subscribe({
      next: (data) => (this.floors = data),
      error: () => this.showMessage('Error al cargar los pisos.', 'error'),
    });
  }

  createFloor(): void {
    this.apiService.create(this.apiUrl, this.floorForm).subscribe({
      next: () => {
        this.showMessage('Piso creado exitosamente.', 'success');
        this.getAllFloors();
        this.clearForm();
      },
      error: () => this.showMessage('Error al crear el piso.', 'error'),
    });
  }

  updateFloor(): void {
    if (this.selectedFloor) {
      this.apiService.update(this.apiUrl, this.selectedFloor.id_floor, this.floorForm).subscribe({
        next: () => {
          this.showMessage('Piso actualizado exitosamente.', 'success');
          this.getAllFloors();
          this.clearForm();
        },
        error: () => this.showMessage('Error al actualizar el piso.', 'error'),
      });
    }
  }

  deleteFloor(id: number): void {
    this.apiService.delete(this.apiUrl, id).subscribe({
      next: () => {
        this.showMessage('Piso eliminado exitosamente.', 'success');
        this.getAllFloors();
      },
      error: () => this.showMessage(`Error al eliminar el piso con ID ${id}.`, 'error'),
    });
  }

  selectFloorForEdit(floor: Floor): void {
    this.selectedFloor = { ...floor };
    this.floorForm = { ...floor };
    this.editMode = true;
  }

  clearForm(): void {
    this.selectedFloor = null;
    this.floorForm = { id_floor: 0, name: '', num_tag: '', id_available: 1, available: '' };
    this.editMode = false;
    this.creatingFloor = false;
  }

  openCreateForm(): void {
    this.clearForm();
    this.creatingFloor = true;
  }

  showMessage(message: string, type: 'success' | 'error'): void {
    this.message = message;
    this.messageType = type;
    setTimeout(() => (this.message = null), 3000);
  }
}
