import { Component, EventEmitter, Output } from '@angular/core';
import { AddTaskComponent } from '../add-task/add-task.component';
import { Task, TaskService } from '../../services/task.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [AddTaskComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  statusFilter = false;
  priorityFilter = false;
  sortToggle = false;
  showAddTaskModal = false;

  @Output() taskCreated = new EventEmitter<Partial<Task>>();

  openAddTaskModal(): void {
    this.showAddTaskModal = true;
  }

  addTask(newTask: Partial<Task>): void {
    this.taskCreated.emit(newTask);
    this.closeModal();
  }

  closeModal(): void {
    this.showAddTaskModal = false;
  }

}
