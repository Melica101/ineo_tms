import { Component, EventEmitter, Output } from '@angular/core';
import { AddTaskComponent } from '../add-task/add-task.component';
import { Task } from '../../services/task.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [AddTaskComponent, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  statusFilter = false;
  priorityFilter = false;
  selectedStatuses: string[] = [];
  selectedPriorities: string[] = [];
  sortToggle = false;
  selectedSortOption: string = '';
  showAddTaskModal = false;
  isHeaderOpen: boolean = false;

  @Output() taskCreated = new EventEmitter<Partial<Task>>();
  @Output() filterChange = new EventEmitter<{ statuses: string[], priorities: string[] }>();
  @Output() sortChange = new EventEmitter<string>();

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

  toggleStatus(status: string) {
    const index = this.selectedStatuses.indexOf(status);
    if (index === -1) {
      this.selectedStatuses.push(status);
    } else {
      this.selectedStatuses.splice(index, 1);
    }
    this.emitFilterChange();
  }

  togglePriority(priority: string) {
    const index = this.selectedPriorities.indexOf(priority);
    if (index === -1) {
      this.selectedPriorities.push(priority);
    } else {
      this.selectedPriorities.splice(index, 1);
    }
    this.emitFilterChange();
  }

  emitFilterChange() {
    this.filterChange.emit({ statuses: this.selectedStatuses, priorities: this.selectedPriorities });
  }

  isStatusSelected(status: string): boolean {
    return this.selectedStatuses.includes(status);
  }

  isPrioritySelected(priority: string): boolean {
    return this.selectedPriorities.includes(priority);
  }

  onSortSelection(sortOption: string) {
    if (this.selectedSortOption === sortOption) {
      this.selectedSortOption = '';
      this.sortChange.emit('');
      return;
    }
    this.selectedSortOption = sortOption;
    this.sortChange.emit(sortOption);
    this.sortToggle = false; // Close the dropdown after selection
  }

  isSelected(sortOption: string): boolean {
    return this.selectedSortOption === sortOption;
  }

}
