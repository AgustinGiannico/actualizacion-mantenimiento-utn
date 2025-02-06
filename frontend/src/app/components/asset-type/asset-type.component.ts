import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { AssetType } from '../../interfaces/asset-type';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { API_BASE_URL } from '../../app.config';

@Component({
  selector: 'app-asset-type',
  templateUrl: './asset-type.component.html',
  styleUrls: ['./asset-type.component.css']
})
export class AssetTypeComponent implements OnInit {
  assetTypes: AssetType[] = [];
  paginatedAssetTypes: AssetType[] = [];
  selectedAssetType: AssetType | null = null;
  message: string | null = null;
  messageType: 'success' | 'error' = 'success';
  showForm: boolean = false;
  assetTypeForm: FormGroup;
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;
  private apiUrl = `${API_BASE_URL}/asset-type`;

  constructor(
    private apiService: ApiService<AssetType>,
    private formBuilder: FormBuilder,
    private location: Location
  ) {
    this.assetTypeForm = this.formBuilder.group({
      id_asset_type: [null],
      name: ['', Validators.required],
      reference: ['', Validators.required],
      num_tag: ['', Validators.required],
      id_available: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.getAllAssetTypes();
  }

  goBack(): void {
    this.location.back();
  }

  getAllAssetTypes(): void {
    this.apiService.getAll(this.apiUrl).subscribe({
      next: (data) => {
        this.assetTypes = data;
        this.updatePagination();
      },
      error: () => this.showMessage('Error al cargar los tipos de activo.', 'error')
    });
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.assetTypes.length / this.itemsPerPage);
    this.updatePaginatedAssetTypes();
  }

  updatePaginatedAssetTypes(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedAssetTypes = this.assetTypes.slice(start, end);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedAssetTypes();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedAssetTypes();
    }
  }

  onSubmit(): void {
    if (this.assetTypeForm.valid) {
      this.selectedAssetType ? this.updateAssetType() : this.createAssetType();
    } else {
      this.showMessage('Formulario inválido. Complete todos los campos.', 'error');
    }
  }

  openCreateForm(): void {
    this.resetAndToggleForm(true);
  }

  clearForm(): void {
    this.resetAndToggleForm(false);
  }

  resetAndToggleForm(show: boolean): void {
    this.assetTypeForm.reset();
    this.assetTypeForm.patchValue({
      id_available: 1,
    });
    this.selectedAssetType = null;
    this.showForm = show;
  }

  createAssetType(): void {
    this.apiService.create(this.apiUrl, this.assetTypeForm.value).subscribe({
      next: () => {
        this.showMessage('Tipo de activo creado exitosamente.', 'success');
        this.getAllAssetTypes();
        this.clearForm();
      },
      error: () => this.showMessage('Error al crear el tipo de activo.', 'error')
    });
  }

  updateAssetType(): void {
    if (this.selectedAssetType) {
      this.apiService.update(this.apiUrl, this.selectedAssetType.id_asset_type, this.assetTypeForm.value).subscribe({
        next: () => {
          this.showMessage('Tipo de activo actualizado exitosamente.', 'success');
          this.getAllAssetTypes();
          this.clearForm();
        },
        error: () => this.showMessage('Error al actualizar el tipo de activo.', 'error')
      });
    }
  }

  deleteAssetType(id: number): void {
    this.apiService.delete(this.apiUrl, id).subscribe({
      next: () => {
        this.showMessage('Tipo de activo eliminado exitosamente.', 'success');
        this.getAllAssetTypes();
      },
      error: () => this.showMessage('Error al eliminar el tipo de activo.', 'error')
    });
  }

  editAssetType(assetType: AssetType): void {
    this.selectedAssetType = assetType;
    this.assetTypeForm.patchValue(assetType);
    this.showForm = true;
  }

  showMessage(message: string, type: 'success' | 'error'): void {
    this.message = message;
    this.messageType = type;
    setTimeout(() => (this.message = null), 3000);
  }
}
