import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { Site } from '../../interfaces/site';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { API_BASE_URL } from '../../app.config';

@Component({
  selector: 'app-site',
  templateUrl: './site.component.html',
  styleUrls: ['./site.component.css'],
})
export class SiteComponent implements OnInit {
  sites: Site[] = [];
  message: string | null = null;
  messageType: 'success' | 'error' = 'success';
  selectedSite: Site | null = null;
  showForm: boolean = false;
  siteForm: FormGroup;
  private apiUrl = `${API_BASE_URL}/site`;

  constructor(
    private apiService: ApiService<Site>,
    private fb: FormBuilder,
    private location: Location
  ) {
    this.siteForm = this.fb.group({
      name: ['', Validators.required],
      num_tag: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.getAllSites();
  }

  goBack(): void {
    this.location.back();
  }

  getAllSites(): void {
    this.apiService.getAll(this.apiUrl).subscribe({
      next: (data) => {
        this.sites = data;
      },
      error: () => this.showMessage('Error al cargar los sitios.', 'error'),
    });
  }

  openCreateForm(): void {
    this.selectedSite = null;
    this.siteForm.reset();
    this.showForm = true;
  }

  clearForm(): void {
    this.siteForm.reset();
    this.selectedSite = null;
    this.showForm = false;
  }

  onSubmit(): void {
    if (this.siteForm.valid) {
      this.selectedSite ? this.updateSite() : this.createSite();
    } else {
      this.showMessage('Formulario inválido. Complete todos los campos.', 'error');
    }
  }

  createSite(): void {
    this.apiService.create(this.apiUrl, this.siteForm.value).subscribe({
      next: () => {
        this.showMessage('Sitio creado exitosamente.', 'success');
        this.getAllSites();
        this.clearForm();
      },
      error: () => this.showMessage('Error al crear el sitio.', 'error'),
    });
  }

  updateSite(): void {
    if (this.selectedSite) {
      this.apiService.update(this.apiUrl, this.selectedSite.id_site, this.siteForm.value).subscribe({
        next: () => {
          this.showMessage('Sitio actualizado exitosamente.', 'success');
          this.getAllSites();
          this.clearForm();
        },
        error: () => this.showMessage('Error al actualizar el sitio.', 'error'),
      });
    }
  }

  deleteSite(id: number): void {
    this.apiService.delete(this.apiUrl, id).subscribe({
      next: () => {
        this.showMessage('Sitio eliminado exitosamente.', 'success');
        this.getAllSites();
      },
      error: () => this.showMessage('Error al eliminar el sitio.', 'error'),
    });
  }

  getSiteById(id: number): void {
    this.apiService.getById(this.apiUrl, id).subscribe({
      next: (site: Site) => {
        this.selectedSite = site;
        this.siteForm.patchValue({
          name: site.name,
          num_tag: site.num_tag,
        });
        this.showForm = true;
      },
      error: () => this.showMessage('Error al cargar el sitio.', 'error'),
    });
  }

  showMessage(message: string, type: 'success' | 'error'): void {
    this.message = message;
    this.messageType = type;
    setTimeout(() => (this.message = null), 3000);
  }
}
