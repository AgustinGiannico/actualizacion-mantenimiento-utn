import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { Ot } from '../../interfaces/ot';
import { EnviarDatosService } from '../../auth/enviar-datos.service';
import { API_BASE_URL } from '../../app.config';

@Component({
  selector: 'app-ot',
  templateUrl: './ot-operario.component.html',
  styleUrls: ['./ot-operario.component.css']
})
export class OtOperarioComponent implements OnInit {
  ots: Ot[] = [];
  paginatedOts: Ot[] = [];
  message: string | null = null;
  messageType: 'success' | 'error' = 'success';
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;

  showModal: boolean = false;
  selectedOt: Ot | null = null;

  private apiUrl = `${API_BASE_URL}/ot`;

  constructor(
    private apiService: ApiService<Ot>,
    private enviarDatosService: EnviarDatosService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.getUserOts();
  }

  goBack(): void {
    this.location.back();
  }

  getUserOts(): void {
    const username = this.enviarDatosService.getUsername();
    if (!username) {
      this.message = 'No se pudo determinar el usuario logueado.';
      return;
    }
  
    this.apiService.getAll(this.apiUrl).subscribe({
      next: (ots) => {
        this.ots = ots.filter(ot => ot.username === username);
        this.updatePagination();
      },
      error: () => {
        this.message = 'Error al cargar las órdenes de trabajo.';
      }
    });
  }
  

  startTask(ot: Ot): void {
    const updatedOt: Partial<Ot> = {
      initial_date: new Date().toISOString().slice(0, 19).replace('T', ' '),
      id_ot_state: 7
    };
  
    this.apiService.update(this.apiUrl, ot.id_ot, updatedOt).subscribe({
      next: () => {
        this.message = `La tarea con número de orden ${ot.order_number} ha sido marcada como "En Progreso".`;
        this.getUserOts();
      },
      error: () => {
        this.message = 'Hubo un error al intentar iniciar la tarea.';
      }
    });
  }
  
  finishTask(ot: Ot): void {
    const completionTime = prompt(`Por favor, ingrese el tiempo total utilizado (en minutos) para la OT con número de orden ${ot.order_number}:`);
  
    if (completionTime !== null) {
      const updatedOt: Partial<Ot> = {
        completion_date: new Date().toISOString().slice(0, 19).replace('T', ' '),
        completion_time: Number(completionTime),
        id_ot_state: 8
      };
  
      this.apiService.update(this.apiUrl, ot.id_ot, updatedOt).subscribe({
        next: () => {
          this.message = `La tarea con número de orden ${ot.order_number} ha sido marcada como "Finalizada".`;
          this.getUserOts();
        },
        error: () => {
          this.message = 'Hubo un error al intentar finalizar la tarea.';
        }
      });
    } else {
      this.message = 'No se ingresó tiempo de finalización. La tarea no se marcó como finalizada.';
    }
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

  showCompleteInfo(ot: Ot): void {
    this.selectedOt = ot;
    this.showModal = true;
  }

  showMessage(message: string | null, type: 'success' | 'error'): void {
    this.message = message;
    this.messageType = type;
    if (message) {
      setTimeout(() => (this.message = null), 3000);
    }
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedOt = null;
  }
}
