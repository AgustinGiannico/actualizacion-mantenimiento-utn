import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Tag } from '../../interfaces/tag';
import { API_BASE_URL } from '../../app.config';

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.css']
})
export class TagComponent implements OnInit {
  tags: Tag[] = [];
  paginatedTags: Tag[] = [];
  tagForm: FormGroup;
  selectedTag: Tag | null = null;
  message: string | null = null;
  messageType: 'success' | 'error' = 'success';
  showForm: boolean = false;
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;

  edifices: { id: number; name: string }[] = [];
  floors: { id: number; name: string }[] = [];
  sectors: { id: number; name: string }[] = [];
  sites: { id: number; name: string }[] = [];
  assetTypes: { id: number; name: string }[] = [];

  private tagApiUrl = `${API_BASE_URL}/tag`;
  private edificeApiUrl = `${API_BASE_URL}/edifice`;
  private floorApiUrl = `${API_BASE_URL}/floor`;
  private sectorApiUrl = `${API_BASE_URL}/sector`;
  private siteApiUrl = `${API_BASE_URL}/site`;
  private assetTypeApiUrl = `${API_BASE_URL}/asset-type`;

  constructor(
    private apiService: ApiService<any>,
    private fb: FormBuilder,
    private location: Location
  ) {
    this.tagForm = this.fb.group({
      id_tag: [null],
      asset_number: ['', Validators.required],
      id_edifice: [null, Validators.required],
      id_floor: [null, Validators.required],
      id_sector: [null, Validators.required],
      id_site: [null, Validators.required],
      id_asset_type: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.getAllTags();
    this.loadDropdownData();
  }

  goBack(): void {
    this.location.back();
  }

  loadDropdownData(): void {
    this.apiService.getAll(this.edificeApiUrl).subscribe({
      next: (data) => (this.edifices = data.map((e: any) => ({ id: e.id_edifice, name: e.name }))),
      error: () => this.showMessage('Error al cargar edificios', 'error')
    });

    this.apiService.getAll(this.floorApiUrl).subscribe({
      next: (data) => (this.floors = data.map((f: any) => ({ id: f.id_floor, name: f.name }))),
      error: () => this.showMessage('Error al cargar pisos', 'error')
    });

    this.apiService.getAll(this.sectorApiUrl).subscribe({
      next: (data) => (this.sectors = data.map((s: any) => ({ id: s.id_sector, name: s.name }))),
      error: () => this.showMessage('Error al cargar sectores', 'error')
    });

    this.apiService.getAll(this.siteApiUrl).subscribe({
      next: (data) => (this.sites = data.map((s: any) => ({ id: s.id_site, name: s.name }))),
      error: () => this.showMessage('Error al cargar sitios', 'error')
    });

    this.apiService.getAll(this.assetTypeApiUrl).subscribe({
      next: (data) => (this.assetTypes = data.map((at: any) => ({ id: at.id_asset_type, name: at.name }))),
      error: () => this.showMessage('Error al cargar tipos de activo', 'error')
    });
  }

  getAllTags(): void {
    this.apiService.getAll(this.tagApiUrl).subscribe({
      next: (tags) => {
        this.tags = tags;
        this.updatePagination();
      },
      error: () => this.showMessage('Error al cargar los tags', 'error')
    });
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.tags.length / this.itemsPerPage);
    this.updatePaginatedTags();
  }

  updatePaginatedTags(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedTags = this.tags.slice(start, end);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedTags();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedTags();
    }
  }

  openCreateForm(): void {
    this.selectedTag = null;
    this.tagForm.reset();
    this.showForm = true;
    this.showMessage(null, 'success');
  }

  clearForm(): void {
    this.tagForm.reset();
    this.selectedTag = null;
    this.showForm = false;
    this.showMessage(null, 'success');
  }

  onSubmit(): void {
    if (this.tagForm.valid) {
      this.selectedTag ? this.updateTag() : this.createTag();
    } else {
      this.showMessage('Formulario inválido. Complete todos los campos.', 'error');
    }
  }

  createTag(): void {
    this.apiService.create(this.tagApiUrl, this.tagForm.value).subscribe({
      next: () => {
        this.getAllTags();
        this.clearForm();
        this.showMessage('Tag creado exitosamente.', 'success');
      },
      error: () => this.showMessage('Error al crear el tag.', 'error')
    });
  }

  updateTag(): void {
    if (this.selectedTag) {
      this.apiService.update(this.tagApiUrl, this.selectedTag.id_tag, this.tagForm.value).subscribe({
        next: () => {
          this.getAllTags();
          this.clearForm();
          this.showMessage('Tag actualizado exitosamente.', 'success');
        },
        error: () => this.showMessage('Error al actualizar el tag.', 'error')
      });
    }
  }

  deleteTag(id: number): void {
    this.apiService.delete(this.tagApiUrl, id).subscribe({
      next: () => {
        this.getAllTags();
        this.showMessage('Tag eliminado exitosamente', 'success');
      },
      error: () => this.showMessage('Error al eliminar el tag', 'error')
    });
  }

  editTag(tag: Tag): void {
    this.selectedTag = tag;
    this.tagForm.patchValue(tag);
    this.showForm = true;
  }

  showMessage(message: string | null, type: 'success' | 'error'): void {
    this.message = message;
    this.messageType = type;
    if (message) {
      setTimeout(() => (this.message = null), 3000);
    }
  }
}
