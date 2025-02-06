import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TaskList } from '../interfaces/task-list';
import { API_BASE_URL } from '../app.config';

@Injectable({
  providedIn: 'root',
})
export class TaskListService {
  private apiUrl = `${API_BASE_URL}/task-list`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<TaskList[]> {
    return this.http.get<TaskList[]>(this.apiUrl, { withCredentials: true });
  }

  getById(id: number): Observable<TaskList> {
    return this.http.get<TaskList>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }

  create(data: TaskList): Observable<TaskList> {
    return this.http.post<TaskList>(this.apiUrl, data, { withCredentials: true });
  }

  update(id: number, data: TaskList): Observable<TaskList> {
    return this.http.patch<TaskList>(`${this.apiUrl}/${id}`, data, { withCredentials: true });
  }  

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }

  getFilteredTaskList(assetType: number, taskType: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/filter`, { asset_type: assetType, task_type: taskType }, { withCredentials: true });
  }
}

