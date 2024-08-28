import { Component, Input } from '@angular/core';
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

  loading = false;
  showTaskDetailsModal = false;

  openTaskDetails(id: number) {
    // this.selectedTask!.id = id;
    this.showTaskDetailsModal = true;
  }

  // updateTask(updatedTask: { title: string; description: string }) {
  //   if (this.selectedTask) {
  //     // Find the task in the list and update it
  //     const taskIndex = this.tasks.findIndex(t => t.title === this.selectedTask?.title && t.description === this.selectedTask?.description);
  //     if (taskIndex > -1) {
  //       this.tasks[taskIndex] = updatedTask;
  //     }
  //   }
  //   this.showTaskDetailsModal = false;
  // }
}
