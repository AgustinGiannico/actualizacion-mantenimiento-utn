import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { Ot } from '../../interfaces/ot';
import { API_BASE_URL } from '../../app.config';

@Component({
  selector: 'app-ot',
  templateUrl: './ot.component.html',
  styleUrls: ['./ot.component.css']
})
export class OtComponent implements OnInit {
  ots: Ot[] = [];
  paginatedOts: Ot[] = [];
  message: string | null = null;
  messageType: 'success' | 'error' = 'success';
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;

  private apiUrl = `${API_BASE_URL}/ot`;

  constructor(private apiService: ApiService<Ot>, private location: Location) {}

  ngOnInit(): void {
    this.getAllOts();
  }

  goBack(): void {
    this.location.back();
  }

  getAllOts(): void {
    this.apiService.getAll(this.apiUrl).subscribe({
      next: (ots) => {
        this.ots = ots;
        this.updatePagination();
      },
      error: () => this.showMessage('Error al cargar las órdenes de trabajo', 'error')
    });
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.ots.length / this.itemsPerPage);
    this.updatePaginatedOts();
  }

  updatePaginatedOts(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedOts = this.ots.slice(start, end);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedOts();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedOts();
    }
  }

  deleteOt(id: number): void {
    this.apiService.delete(this.apiUrl, id).subscribe({
      next: () => {
        this.ots = this.ots.filter((ot) => ot.id_ot !== id);
        this.updatePagination();
        this.showMessage('OT eliminada exitosamente.', 'success');
      },
      error: () => this.showMessage('Error al eliminar la OT.', 'error')
    });
  }

  showMessage(message: string | null, type: 'success' | 'error'): void {
    this.message = message;
    this.messageType = type;
    if (message) {
      setTimeout(() => (this.message = null), 3000);
    }
  }
}
