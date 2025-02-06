import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaskListService } from '../../services/task-list.service';
import { TaskList } from '../../interfaces/task-list';
import { ApiService } from '../../services/api.service';
import { API_BASE_URL } from '../../app.config';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  taskLists: TaskList[] = [];
  paginatedTaskLists: TaskList[] = [];
  taskListForm: FormGroup;
  message: string | null = null;
  messageType: 'success' | 'error' = 'success';
  showForm: boolean = false;
  selectedTaskList: TaskList | null = null;
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;

  assetTypes: { id: number; name: string }[] = [];
  taskTypes: { id: number; name: string }[] = [];
  tasks: { id: number; name: string }[] = [];

  steps = [
    { label: 'Paso 1', field: 'step_1' as keyof TaskList },
    { label: 'Paso 2', field: 'step_2' as keyof TaskList },
    { label: 'Paso 3', field: 'step_3' as keyof TaskList },
    { label: 'Paso 4', field: 'step_4' as keyof TaskList },
    { label: 'Paso 5', field: 'step_5' as keyof TaskList },
    { label: 'Paso 6', field: 'step_6' as keyof TaskList },
    { label: 'Paso 7', field: 'step_7' as keyof TaskList },
    { label: 'Paso 8', field: 'step_8' as keyof TaskList },
    { label: 'Paso 9', field: 'step_9' as keyof TaskList },
    { label: 'Paso 10', field: 'step_10' as keyof TaskList }
  ];

  private assetTypeUrl = `${API_BASE_URL}/asset-type`;
  private taskTypeUrl = `${API_BASE_URL}/task-type`;
  private taskUrl = `${API_BASE_URL}/task`;

  constructor(
    private taskListService: TaskListService,
    private apiService: ApiService<any>,
    private fb: FormBuilder,
    private location: Location
  ) {
    this.taskListForm = this.fb.group({
      id_task_list: [null],
      id_asset_type: [null, Validators.required],
      id_task_type: [null, Validators.required],
      step_1: [null, Validators.required],
      step_2: [null, Validators.required],
      step_3: [null, Validators.required],
      step_4: [null, Validators.required],
      step_5: [null, Validators.required],
      step_6: [null, Validators.required],
      step_7: [null, Validators.required],
      step_8: [null, Validators.required],
      step_9: [null, Validators.required],
      step_10: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.getAllTaskLists();
    this.loadDropdownData();
  }

  goBack(): void {
    this.location.back();
  }

  loadDropdownData(): void {
    this.apiService.getAll(this.assetTypeUrl).subscribe({
      next: (data) => (this.assetTypes = data.map((item: any) => ({ id: item.id_asset_type, name: item.name }))),
      error: () => this.showMessage('Error al cargar tipos de activo', 'error')
    });

    this.apiService.getAll(this.taskTypeUrl).subscribe({
      next: (data) => (this.taskTypes = data.map((item: any) => ({ id: item.id_task_type, name: item.name }))),
      error: () => this.showMessage('Error al cargar tipos de tarea', 'error')
    });

    this.apiService.getAll(this.taskUrl).subscribe({
      next: (data) => (this.tasks = data.map((item: any) => ({ id: item.id_task, name: item.description }))),
      error: () => this.showMessage('Error al cargar tareas', 'error')
    });
  }

  getAllTaskLists(): void {
    this.taskListService.getAll().subscribe({
      next: (taskLists) => {
        this.taskLists = taskLists;
        this.updatePagination();
      },
      error: () => this.showMessage('Error al cargar las listas de tareas', 'error')
    });
  }

  openCreateForm(): void {
    this.selectedTaskList = null;
    this.taskListForm.reset();
    this.showForm = true;
    this.showMessage(null, 'success');
  }

  clearForm(): void {
    this.taskListForm.reset();
    this.selectedTaskList = null;
    this.showForm = false;
    this.showMessage(null, 'success');
  }

  onSubmit(): void {
    if (this.taskListForm.valid) {
      this.selectedTaskList ? this.updateTaskList() : this.createTaskList();
    } else {
      this.showMessage('Formulario inválido. Complete todos los campos.', 'error');
    }
  }

  createTaskList(): void {
    this.taskListService.create(this.taskListForm.value).subscribe({
      next: () => {
        this.getAllTaskLists();
        this.clearForm();
        this.showMessage('Lista de tareas creada exitosamente.', 'success');
      },
      error: (err) => {
        console.error('Error al crear la lista de tareas:', err);
        this.showMessage('Error al crear la lista de tareas.', 'error');
      }
    });
  }

  updateTaskList(): void {
    const { id_task_list, ...data } = this.taskListForm.value;
    this.taskListService.update(id_task_list, data).subscribe({
      next: (updatedTaskList) => {
        const index = this.taskLists.findIndex((taskList) => taskList.id_task_list === updatedTaskList.id_task_list);
        if (index !== -1) this.taskLists[index] = updatedTaskList;
        this.updatePagination();
        this.clearForm();
        this.showMessage('Lista de tareas actualizada exitosamente.', 'success');
      },
      error: () => this.showMessage('Error al actualizar la lista de tareas.', 'error')
    });
  }

  deleteTaskList(id: number): void {
    this.taskListService.delete(id).subscribe({
      next: () => {
        this.taskLists = this.taskLists.filter((taskList) => taskList.id_task_list !== id);
        this.updatePagination();
        this.showMessage('Lista de tareas eliminada exitosamente.', 'success');
      },
      error: () => this.showMessage('Error al eliminar la lista de tareas.', 'error')
    });
  }

  editTaskList(taskList: TaskList): void {
    this.selectedTaskList = taskList;
    this.taskListForm.patchValue(taskList);
    this.showForm = true;
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.taskLists.length / this.itemsPerPage);
    this.updatePaginatedTaskLists();
  }

  updatePaginatedTaskLists(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedTaskLists = this.taskLists.slice(start, end);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedTaskLists();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedTaskLists();
    }
  }

  showMessage(message: string | null, type: 'success' | 'error'): void {
    this.message = message;
    this.messageType = type;
    if (message) {
      setTimeout(() => (this.message = null), 3000);
    }
  }
}
