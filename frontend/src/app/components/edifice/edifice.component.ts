import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { Edifice } from '../../interfaces/edifice';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { API_BASE_URL } from '../../app.config';

@Component({
  selector: 'app-edifice',
  templateUrl: './edifice.component.html',
  styleUrls: ['./edifice.component.css'],
})
export class EdificeComponent implements OnInit {
  edifices: Edifice[] = [];
  message: string | null = null;
  messageType: 'success' | 'error' = 'success';
  selectedEdifice: Edifice | null = null;
  showForm: boolean = false;
  edificeForm: FormGroup;
  locations: { id_location: number; name: string }[] = [];
  private apiUrl = `${API_BASE_URL}/edifice`;
  private locationApiUrl = `${API_BASE_URL}/location`;

  constructor(
    private apiService: ApiService<Edifice>,
    private fb: FormBuilder,
    private location: Location
  ) {
    this.edificeForm = this.fb.group({
      name: ['', Validators.required],
      num_tag: ['', Validators.required],
      street: ['', Validators.required],
      number: ['', Validators.required],
      id_location: [null, Validators.required],
      id_available: [1, Validators.required],
    });
  }

  ngOnInit(): void {
    this.getAllEdifices();
    this.loadLocations();
  }

  goBack(): void {
    this.location.back();
  }

  loadLocations(): void {
    this.apiService.getAll(this.locationApiUrl).subscribe({
      next: (data) => {
        this.locations = data.map((location: any) => ({
          id_location: location.id_location,
          name: location.name,
        }));
        console.log('Localidades cargadas:', this.locations);
      },
      error: (error) => {
        this.showMessage('Error al cargar localidades', 'error');
        console.error('Error al cargar localidades:', error);
      },
    });
  }

  getAllEdifices(): void {
    this.apiService.getAll(this.apiUrl).subscribe({
      next: (data) => {
        this.edifices = data;
        console.log('Edificios cargados:', this.edifices);
      },
      error: (error) => {
        this.showMessage(`Error al cargar los edificios: ${error}`, 'error');
      },
    });
  }

  getEdificeById(id: number): void {
    this.apiService.getById(this.apiUrl, id).subscribe({
      next: (edifice: Edifice) => {
        this.selectedEdifice = edifice;
        this.edificeForm.patchValue({
          name: edifice.name,
          num_tag: edifice.num_tag,
          street: edifice.street,
          number: edifice.number,
          id_location: edifice.id_location,
          id_available: edifice.id_available,
        });
        this.showForm = true;
      },
      error: (err) => {
        console.error('Error al cargar el edificio:', err);
        this.showMessage('Error al cargar el edificio.', 'error');
      },
    });
  }

  openCreateForm(): void {
    this.selectedEdifice = null;
    this.edificeForm.reset();
    this.edificeForm.patchValue({
      id_available: 1,
    });
    this.showForm = true;
  }

  clearForm(): void {
    this.edificeForm.reset();
    this.selectedEdifice = null;
    this.showForm = false;
  }

  onSubmit(): void {
    if (this.edificeForm.valid) {
      console.log('Datos enviados al backend:', this.edificeForm.value);

      if (this.selectedEdifice) {
        this.apiService.update(this.apiUrl, this.selectedEdifice.id_edifice, this.edificeForm.value).subscribe({
          next: () => {
            this.showMessage('Edificio actualizado exitosamente.', 'success');
            this.getAllEdifices();
            this.clearForm();
          },
          error: (err) => {
            console.error('Error al actualizar el edificio:', err);
            this.showMessage('Error al actualizar el edificio.', 'error');
          },
        });
      } else {
        this.apiService.create(this.apiUrl, this.edificeForm.value).subscribe({
          next: () => {
            this.showMessage('Edificio creado exitosamente.', 'success');
            this.getAllEdifices();
            this.clearForm();
          },
          error: (err) => {
            console.error('Error al crear el edificio:', err);
            this.showMessage('Error al crear el edificio.', 'error');
          },
        });
      }
    } else {
      console.warn('Formulario inválido.');
    }
  }

  deleteEdifice(id: number): void {
    this.apiService.delete(this.apiUrl, id).subscribe({
      next: () => {
        this.showMessage('Edificio eliminado exitosamente.', 'success');
        this.getAllEdifices();
      },
      error: (err) => {
        this.showMessage('Error al eliminar el edificio.', 'error');
      },
    });
  }

  showMessage(message: string, type: 'success' | 'error'): void {
    this.message = message;
    this.messageType = type;
    setTimeout(() => (this.message = null), 3000);
  }
}
