import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Task } from '../../interfaces/task';
import { API_BASE_URL } from '../../app.config';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {
  tasks: Task[] = [];
  paginatedTasks: Task[] = [];
  taskForm: FormGroup;
  selectedTask: Task | null = null;
  message: string | null = null;
  messageType: 'success' | 'error' = 'success';
  showForm: boolean = false;
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;

  private taskApiUrl = `${API_BASE_URL}/task`;

  constructor(
    private apiService: ApiService<any>,
    private fb: FormBuilder,
    private location: Location
  ) {
    this.taskForm = this.fb.group({
      id_task: [null],
      description: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.getAllTasks();
  }

  goBack(): void {
    this.location.back();
  }

  getAllTasks(): void {
    this.apiService.getAll(this.taskApiUrl).subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.updatePagination();
      },
      error: () => this.showMessage('Error al cargar las tareas.', 'error')
    });
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.tasks.length / this.itemsPerPage);
    this.updatePaginatedTasks();
  }

  updatePaginatedTasks(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedTasks = this.tasks.slice(start, end);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedTasks();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedTasks();
    }
  }

  openCreateForm(): void {
    this.selectedTask = null;
    this.taskForm.reset();
    this.showForm = true;
    this.showMessage(null, 'success');
  }

  clearForm(): void {
    this.taskForm.reset();
    this.selectedTask = null;
    this.showForm = false;
    this.showMessage(null, 'success');
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      this.selectedTask ? this.updateTask() : this.createTask();
    } else {
      this.showMessage('Formulario inválido. Complete todos los campos.', 'error');
    }
  }

  createTask(): void {
    this.apiService.create(this.taskApiUrl, this.taskForm.value).subscribe({
      next: () => {
        this.getAllTasks();
        this.clearForm();
        this.showMessage('Tarea creada exitosamente.', 'success');
      },
      error: () => this.showMessage('Error al crear la tarea.', 'error')
    });
  }

  updateTask(): void {
    if (this.selectedTask) {
      console.log('Datos enviados al backend:', this.taskForm.value);
      this.apiService.update(this.taskApiUrl, this.selectedTask.id_task, this.taskForm.value).subscribe({
        next: () => {
          this.getAllTasks();
          this.clearForm();
          this.showMessage('Tarea actualizada exitosamente.', 'success');
        },
        error: (error) => {
          console.error('Error al actualizar la tarea:', error);
          this.showMessage('Error al actualizar la tarea.', 'error');
        }
      });
    }
  }

  deleteTask(id: number): void {
    this.apiService.delete(this.taskApiUrl, id).subscribe({
      next: () => {
        this.getAllTasks();
        this.showMessage('Tarea eliminada exitosamente.', 'success');
      },
      error: () => this.showMessage('Error al eliminar la tarea.', 'error')
    });
  }

  editTask(task: Task): void {
    this.selectedTask = task;
    this.taskForm.patchValue(task);
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
