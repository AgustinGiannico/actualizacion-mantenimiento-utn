import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { Sector } from '../../interfaces/sector';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { API_BASE_URL } from '../../app.config';

@Component({
  selector: 'app-sector',
  templateUrl: './sector.component.html',
  styleUrls: ['./sector.component.css'],
})
export class SectorComponent implements OnInit {
  sectors: Sector[] = [];
  paginatedSectors: Sector[] = [];
  sectorForm: FormGroup;
  message: string | null = null;
  messageType: 'success' | 'error' = 'success';
  showForm: boolean = false;
  selectedSector: Sector | null = null;
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;

  private apiUrl = `${API_BASE_URL}/sector`;

  constructor(
    private apiService: ApiService<Sector>, 
    private formBuilder: FormBuilder, 
    private location: Location
  ) {
    this.sectorForm = this.formBuilder.group({
      id_sector: [null],
      name: ['', Validators.required],
      num_tag: ['', Validators.required],
      id_available: [null],
      available: [''],
    });
  }

  ngOnInit(): void {
    this.getAllSectors();
  }

  goBack(): void {
    this.location.back();
  }

  getAllSectors(): void {
    this.apiService.getAll(this.apiUrl).subscribe({
      next: (data) => {
        this.sectors = data;
        this.updatePagination();
      },
      error: () => this.showMessage('Error al cargar los sectores.', 'error'),
    });
  }

  openCreateForm(): void {
    this.selectedSector = null;
    this.sectorForm.reset();
    this.sectorForm.patchValue({
      id_available: 1,
      available: 'Disponible',
    });
    this.showForm = true;
  }

  clearForm(): void {
    this.sectorForm.reset();
    this.sectorForm.patchValue({
      id_available: 1,
      available: 'Disponible',
    });
    this.selectedSector = null;
    this.showForm = false;
  }

  onSubmit(): void {
    if (this.sectorForm.valid) {
      this.selectedSector ? this.updateSector() : this.createSector();
    } else {
      this.showMessage('Formulario inválido. Complete todos los campos.', 'error');
    }
  }

  createSector(): void {
    this.apiService.create(this.apiUrl, this.sectorForm.value).subscribe({
      next: (newSector) => {
        this.showMessage('Sector creado exitosamente.', 'success');
        this.getAllSectors();
        setTimeout(() => this.clearForm(), 3000);
      },
      error: () => this.showMessage('Error al crear el sector.', 'error'),
    });
  }

  updateSector(): void {
    if (this.selectedSector) {
      this.apiService.update(this.apiUrl, this.selectedSector.id_sector, this.sectorForm.value).subscribe({
        next: () => {
          this.showMessage('Sector actualizado exitosamente.', 'success');
          this.getAllSectors();
          setTimeout(() => this.clearForm(), 3000);
        },
        error: (error) => {
          console.error('Error al actualizar el sector:', error);
          this.showMessage('Error al actualizar el sector.', 'error');
        },
      });
    }
  }

  deleteSector(id: number): void {
    this.apiService.delete(this.apiUrl, id).subscribe({
      next: () => {
        this.sectors = this.sectors.filter((sector) => sector.id_sector !== id);
        this.updatePagination();
        this.showMessage('Sector eliminado exitosamente.', 'success');
      },
      error: () => this.showMessage('Error al eliminar el sector.', 'error'),
    });
  }

  editSector(sector: Sector): void {
    this.selectedSector = sector;
    this.sectorForm.patchValue(sector);
    this.showForm = true;
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.sectors.length / this.itemsPerPage);
    this.updatePaginatedSectors();
  }

  updatePaginatedSectors(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedSectors = this.sectors.slice(start, end);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedSectors();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedSectors();
    }
  }

  showMessage(message: string, type: 'success' | 'error'): void {
    this.message = message;
    this.messageType = type;
    setTimeout(() => (this.message = null), 3000);
  }
}
