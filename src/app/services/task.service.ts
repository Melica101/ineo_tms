import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { delay, map } from 'rxjs/operators';

export interface Task {
  id: number;
  title: string;
  description: string;
  status: 'todo' | 'doing' | 'done';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  order: number;
}

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiUrl = 'http://localhost:3000/tasks';

  constructor(private http: HttpClient) {}

  // CREATE a new task
  createTask(task: Partial<Task>): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task);
  }

  // READ tasks
  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl).pipe(
      delay(3000), // Simulate network latency
      // map(tasks => tasks.sort((a, b) => a.order - b.order))
    );
  }

  async getData(): Promise<Task[]> {
    // Simulate the delay using a Promise and setTimeout
    await new Promise(resolve => setTimeout(resolve, 3000));
    const tasks = await this.http.get<Task[]>(this.apiUrl).toPromise();

    // Ensure the result is always an array
    return tasks ? tasks.sort((a, b) => a.order - b.order) : [];
  }

  // UPDATE task status and order
  updateTask(task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${task.id}`, task);
  }

  // DELETE a task
  deleteTask(taskId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${taskId}`);
  }

  // Utility function to generate new order numbers for tasks
  generateNewTaskOrder(tasks: Task[]): number {
    return tasks.length > 0 ? Math.max(...tasks.map(t => t.order)) + 1 : 1;
  }
}
