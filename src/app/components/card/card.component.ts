import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddTaskComponent } from '../add-task/add-task.component';
import { TaskDetailsComponent } from '../task-details/task-details.component';
import { Task } from '../../services/task.service';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule, AddTaskComponent, TaskDetailsComponent],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
})
export class CardComponent {
  @Input() task!: Task;
  @Output() deleteTask = new EventEmitter<Task>();
  @Output() openDetails = new EventEmitter<Task>();

  loading = false;

  onDelete(): void {
    this.deleteTask.emit(this.task);
  }

  details(): void {
    this.openDetails.emit(this.task);
  }
}
