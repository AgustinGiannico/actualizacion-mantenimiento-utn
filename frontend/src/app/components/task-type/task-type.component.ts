import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { TaskType } from '../../interfaces/task-type';
import { API_BASE_URL } from '../../app.config';

@Component({
  selector: 'app-task-type',
  templateUrl: './task-type.component.html',
  styleUrls: ['./task-type.component.css']
})
export class TaskTypeComponent implements OnInit {
  taskTypes: TaskType[] = [];
  paginatedTaskTypes: TaskType[] = [];
  taskTypeForm: FormGroup;
  selectedTaskType: TaskType | null = null;
  message: string | null = null;
  messageType: 'success' | 'error' = 'success';
  showForm: boolean = false;
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;

  private taskTypeApiUrl = `${API_BASE_URL}/task-type`;

  constructor(
    private apiService: ApiService<TaskType>,
    private fb: FormBuilder,
    private location: Location
  ) {
    this.taskTypeForm = this.fb.group({
      id_task_type: [null],
      name: ['', Validators.required],
      code: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.getAllTaskTypes();
  }

  goBack(): void {
    this.location.back();
  }

  getAllTaskTypes(): void {
    this.apiService.getAll(this.taskTypeApiUrl).subscribe({
      next: (taskTypes) => {
        this.taskTypes = taskTypes;
        this.updatePagination();
      },
      error: () => this.showMessage('Error al cargar los tipos de tareas', 'error')
    });
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.taskTypes.length / this.itemsPerPage);
    this.updatePaginatedTaskTypes();
  }

  updatePaginatedTaskTypes(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedTaskTypes = this.taskTypes.slice(start, end);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedTaskTypes();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedTaskTypes();
    }
  }

  openCreateForm(): void {
    this.selectedTaskType = null;
    this.taskTypeForm.reset();
    this.showForm = true;
    this.showMessage(null, 'success');
  }

  clearForm(): void {
    this.taskTypeForm.reset();
    this.selectedTaskType = null;
    this.showForm = false;
    this.showMessage(null, 'success');
  }

  onSubmit(): void {
    if (this.taskTypeForm.valid) {
      this.selectedTaskType ? this.updateTaskType() : this.createTaskType();
    } else {
      this.showMessage('Formulario inválido. Complete todos los campos.', 'error');
    }
  }

  createTaskType(): void {
    this.apiService.create(this.taskTypeApiUrl, this.taskTypeForm.value).subscribe({
      next: () => {
        this.getAllTaskTypes();
        this.clearForm();
        this.showMessage('Tipo de tarea creado exitosamente.', 'success');
      },
      error: () => this.showMessage('Error al crear el tipo de tarea.', 'error')
    });
  }

  updateTaskType(): void {
    if (this.selectedTaskType) {
      this.apiService.update(this.taskTypeApiUrl, this.selectedTaskType.id_task_type, this.taskTypeForm.value).subscribe({
        next: (updatedTaskType) => {
          console.log('Respuesta del backend:', updatedTaskType);
  
          const index = this.taskTypes.findIndex(taskType => taskType.id_task_type === updatedTaskType.id_task_type);
          if (index !== -1) {
            this.taskTypes[index] = updatedTaskType;
          }
  
          this.updatePagination();
          this.clearForm();
          this.showMessage('Tipo de tarea actualizado exitosamente.', 'success');
        },
        error: (error) => {
          console.error('Error al actualizar el tipo de tarea:', error);
          console.log('Detalles del error:', error.message, error.status, error.error);
          this.showMessage('Error al actualizar el tipo de tarea.', 'error');
        }
      });
    }
  }
  
  deleteTaskType(id: number): void {
    this.apiService.delete(this.taskTypeApiUrl, id).subscribe({
      next: () => {
        this.getAllTaskTypes();
        this.showMessage('Tipo de tarea eliminado exitosamente.', 'success');
      },
      error: () => this.showMessage('Error al eliminar el tipo de tarea.', 'error')
    });
  }

  editTaskType(taskType: TaskType): void {
    this.selectedTaskType = taskType;
    this.taskTypeForm.patchValue(taskType);
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