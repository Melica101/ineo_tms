import { Component } from '@angular/core';
import { AddTaskComponent } from '../add-task/add-task.component';

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
  showModal = false;

  handleTaskAdded(task: { title: string; description: string }) {
    console.log('Task Added:', task);
    this.showModal = false;
    // Handle the added task (e.g., push to a tasks array)
  }
}
