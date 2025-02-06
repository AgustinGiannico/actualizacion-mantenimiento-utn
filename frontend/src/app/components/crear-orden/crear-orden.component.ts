import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Location } from '@angular/common';
import { ApiService } from 'src/app/services/api.service';
import { TaskListService } from 'src/app/services/task-list.service';
import { TaskList } from 'src/app/interfaces/task-list';
import { Ot } from '../../interfaces/ot';
import { User } from '../../interfaces/user';
import { AssetType } from '../../interfaces/asset-type';
import { Tag } from '../../interfaces/tag';
import { Priority } from '../../interfaces/priority';
import { Edifice } from '../../interfaces/edifice';
import { Floor } from '../../interfaces/floor';
import { Sector } from '../../interfaces/sector';
import { Site } from '../../interfaces/site';
import { TaskType } from '../../interfaces/task-type';
import { Task } from '../../interfaces/task';
import { API_BASE_URL } from '../../app.config';

@Component({
  selector: 'app-gestion-ordenes',
  templateUrl: './crear-orden.component.html',
  styleUrls: ['./crear-orden.component.css']
})
export class CrearOrdenComponent implements OnInit {
  ordenes: Ot[] = [];
  users: User[] = [];
  assetTypes: AssetType[] = [];
  priorities: Priority[] = [];
  edifices: Edifice[] = [];
  sectors: Sector[] = [];
  sites: Site[] = [];
  floors: Floor[] = [];
  taskLists: TaskList[] = [];
  taskTypes: TaskType[] = [];
  allTags: Tag[] = [];
  tasks: Task[] = [];
  selectedOt: Ot = {
    id_ot: 0,
    order_number: '',
    request_date: new Date(),
    initial_date: new Date(),
    completion_date: new Date(),
    completion_time: 0,
    observations: '',
    id_user: 0,
    id_task_list: 0,
    id_priority: 0,
    id_ot_state: 0,
    id_tag: 0,
    id_task_type: 0,
    id_asset_type: 0
  };
  selectedTag?: string;
  selectedAssetTypeName?: string;
  selectedEdificeName?: string;
  selectedFloorName?: string;
  selectedSector?: string;
  selectedSite?: string;
  selectedTaskListSteps: string[] = [];
  selectedPriorityDescription: string = 'No asignado';
  selectedTaskTypeDescription: string = 'No asignado';

  private apiUrls = {
    ot: `${API_BASE_URL}/ot`,
    users: `${API_BASE_URL}/user`,
    assetTypes: `${API_BASE_URL}/asset-type`,
    priorities: `${API_BASE_URL}/priority`,
    edifices: `${API_BASE_URL}/edifice`,
    floors: `${API_BASE_URL}/floor`,
    sectors: `${API_BASE_URL}/sector`,
    sites: `${API_BASE_URL}/site`,
    tags: `${API_BASE_URL}/tag`,
    taskTypes: `${API_BASE_URL}/task-type`,
    tasks: `${API_BASE_URL}/task`
  };

  @Output() ordenCreada = new EventEmitter<Ot>();

  constructor(
    private apiService: ApiService<any>,
    private taskListService: TaskListService,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.loadUsers();
    this.loadAssetTypes();
    this.loadPriorities();
    this.loadAllTags();
    this.loadEdifices();
    this.loadFloors();
    this.loadSectors();
    this.loadSites();
    this.loadTaskTypes();
  }

  goBack(): void {
    this.location.back();
  }

  loadUsers(): void {
    this.apiService.getAll(this.apiUrls.users).subscribe(data => this.users = data);
  }

  loadAssetTypes(): void {
    this.apiService.getAll(this.apiUrls.assetTypes).subscribe(data => this.assetTypes = data);
  }

  loadAllTags(): void {
    this.apiService.getAll(this.apiUrls.tags).subscribe(data => this.allTags = data);
  }

  loadEdifices(): void {
    this.apiService.getAll(this.apiUrls.edifices).subscribe({
      next: (data) => {
        this.edifices = data;
      },
      error: (err) => {
        console.error("Error al cargar los edificios:", err);
      }
    });
  }

  loadFloors(): void {
    this.apiService.getAll(this.apiUrls.floors).subscribe(data => this.floors = data);
  }

  loadSectors(): void {
    this.apiService.getAll(this.apiUrls.sectors).subscribe(data => this.sectors = data);
  }

  loadSites(): void {
    this.apiService.getAll(this.apiUrls.sites).subscribe(data => this.sites = data);
  }

  loadPriorities(): Promise<void> {
    return new Promise((resolve) => {
      this.apiService.getAll(this.apiUrls.priorities).subscribe(data => {
        this.priorities = data;
        this.onPriorityChange();
        resolve();
      });
    });
  }

  loadTaskTypes(): Promise<void> {
    return new Promise((resolve) => {
      this.apiService.getAll(this.apiUrls.taskTypes).subscribe(data => {
        this.taskTypes = data;
        resolve();
      });
    });
  }

  onTagChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const selectedTag = this.allTags.find(tag => tag.final_tag === target.value);

    if (selectedTag) {
      this.selectedOt.id_tag = selectedTag.id_tag;
      this.selectedTag = selectedTag.final_tag;
      this.selectedAssetTypeName = selectedTag.asset_type;
      this.selectedEdificeName = selectedTag.edifice;
      this.selectedFloorName = selectedTag.floor;
      this.selectedSector = selectedTag.sector;
      this.selectedSite = selectedTag.site;

      const assetType = this.assetTypes.find(type => type.name === this.selectedAssetTypeName);
      if (assetType) {
        this.selectedOt.id_asset_type = assetType.id_asset_type;
      }

      this.updateTaskList();
    }
  }

  onTaskTypeChange(): void {
    const selectedTaskTypeId = Number(this.selectedOt?.id_task_type);
    const taskType = this.taskTypes.find(tt => tt.id_task_type === selectedTaskTypeId);

    this.selectedTaskTypeDescription = taskType ? taskType.name : 'No asignado';
    this.updateTaskList();
  }

  updateTaskList(): void {
    if (this.selectedOt?.id_asset_type && this.selectedOt?.id_task_type) {
      const assetTypeId = this.selectedOt.id_asset_type;
      const taskTypeId = this.selectedOt.id_task_type;
      this.loadTaskList(assetTypeId, taskTypeId);
    } else {
      console.error("Faltan datos de id_asset_type o id_task_type para cargar la lista de tareas.");
    }
  }

  loadTaskList(assetTypeId: number, taskTypeId: number): void {
    this.taskListService.getFilteredTaskList(assetTypeId, taskTypeId).subscribe({
      next: (taskLists) => {
        if (taskLists.length > 0) {
          const taskList = taskLists[0];
          this.selectedOt.id_task_list = taskList.id_task_list;
          this.selectedTaskListSteps = [
            taskList.step_1,
            taskList.step_2,
            taskList.step_3,
            taskList.step_4,
            taskList.step_5,
            taskList.step_6,
            taskList.step_7,
            taskList.step_8,
            taskList.step_9,
            taskList.step_10
          ].filter((step) => step);
        } else {
          this.selectedTaskListSteps = [];
          this.selectedOt.id_task_list = 0;
        }
      },
      error: (error) => {
        console.error("Error al cargar la lista de tareas:", error);
      }
    });
  }

  onPriorityChange(): void {
    const selectedPriorityId = +this.selectedOt?.id_priority;
    const priority = this.priorities.find(p => +p.id_priority === selectedPriorityId);
    this.selectedPriorityDescription = priority ? priority.description : 'No asignado';
  }

  createOt(): void {
    if (this.selectedOt) {
      this.selectedOt.request_date = this.formatDateForMySQL(new Date());
      this.selectedOt.initial_date = this.formatDateForMySQL(this.selectedOt.initial_date);
      this.selectedOt.completion_date = this.formatDateForMySQL(this.selectedOt.completion_date);
  
      if (!this.selectedOt.id_task_list || this.selectedOt.id_task_list === 0) {
        if (!this.selectedOt.id_task_type || this.selectedOt.id_task_type === 0) {
          console.error("Error: Debes seleccionar un tipo de tarea (id_task_type) si no se elige una lista de tareas.");
          return;
        }
        this.selectedOt.id_task_list = null;
      }

      this.apiService.create(this.apiUrls.ot, this.selectedOt).subscribe({
        next: (newOt) => {
          this.ordenCreada.emit(newOt);
          this.resetForm();
        },
        error: (err) => console.error("Error al guardar la OT:", err.error || err),
      });
    }
  }
  
  formatDateForMySQL(date: Date | string | null): string {
    if (!date) return '';
    if (date instanceof Date) {
      return date.toISOString().split('T')[0];
    }
    return date;
  }  

  resetForm(): void {
    this.selectedOt = {
      id_ot: 0,
      order_number: '',
      request_date: new Date(),
      initial_date: new Date(),
      completion_date: new Date(),
      completion_time: 0,
      observations: '',
      id_user: 0,
      id_task_list: 0,
      id_priority: 0,
      id_ot_state: 6,
      id_tag: 0,
      id_task_type: 0,
      id_asset_type: 0,
    };
    this.selectedAssetTypeName = '';
    this.selectedEdificeName = '';
    this.selectedFloorName = '';
    this.selectedSector = '';
    this.selectedSite = '';
    this.selectedTaskListSteps = [];
  }

  getTaskTypeName(id: number | null): string {
    const taskType = this.taskTypes.find(tt => tt.id_task_type === id);
    return taskType ? taskType.name : 'No asignado';
  }
}
