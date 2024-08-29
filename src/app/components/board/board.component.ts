import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../card/card.component';
import { Task, TaskService } from '../../services/task.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';
import { TaskDetailsComponent } from '../task-details/task-details.component';
import { DeleteModalComponent } from '../delete-modal/delete-modal.component';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, CardComponent, DragDropModule, FormsModule, TaskDetailsComponent, DeleteModalComponent],
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent {
  todo: Task[] = [];
  doing: Task[] = [];
  done: Task[] = [];
  loading = true;

  showModal = false;
  selectedTask: Task | null = null;
  taskToView: Task | null = null;
  taskToDelete: Task | null = null;
  showDeleteConfirmation = false;

  @Input() newTask: Task | null = null;
  @Input() tasks: Task[] = [];
  @Input() filteredTasks: Task[] = [];


  constructor(private taskService: TaskService) { }

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.loading = true;
    this.taskService.getTasks().subscribe(tasks => {
      this.loading = false;
      this.tasks = tasks;
      this.filteredTasks = tasks;
      this.todo = tasks.filter(task => task.status === 'todo');
      this.doing = tasks.filter(task => task.status === 'doing');
      this.done = tasks.filter(task => task.status === 'done');
    });
  }

  handleTaskCreated(newTask: Partial<Task>): void {
    const taskToCreate: Partial<Task> = {
      ...newTask,
      order: this.taskService.generateNewTaskOrder(this.todo),
      status: 'todo'  // Assuming new tasks start in the "To Do" column
    };

    // Call the createTask method in the service, which sends a POST request to the backend
    this.taskService.createTask(taskToCreate).subscribe(() => {
      // After the task is created, reload the tasks from the server
      this.loadTasks();
    });
  }

  openTaskDetails(task: Task): void {
    this.taskToView = task;
    this.showModal = true;
  }

  saveTask(updatedTask: Task): void {
    this.taskService.updateTask(updatedTask).subscribe(() => {
      this.loadTasks();
      this.closeModal();
    });
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedTask = null;
  }

  onTaskDeleteRequested(task: Task): void {
    this.taskToDelete = task;
    this.showDeleteConfirmation = true;
  }

  deleteTask(): void {
    if (this.taskToDelete) {
      this.taskService.deleteTask(this.taskToDelete.id).subscribe(() => {
        this.loadTasks();
        this.closeDeleteConfirmation();
      });
    }
  }

  closeDeleteConfirmation(): void {
    this.showDeleteConfirmation = false;
    this.taskToDelete = null;
  }

  drop(event: CdkDragDrop<Task[]>): void {
    if (event.previousContainer === event.container) {
      // Reordering within the same column
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      this.updateTaskOrders(event.container.data);
    } else {
      // Moving between columns
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);

      const task = event.container.data[event.currentIndex];
      const newStatus = event.container.id as 'todo' | 'doing' | 'done';
      task.status = newStatus;
      task.order = this.taskService.generateNewTaskOrder(event.container.data);

      this.taskService.updateTask(task).subscribe(() => {
        this.loadTasks();
      });
    }
  }

  updateTaskOrders(tasks: Task[]): void {
    tasks.forEach((task, index) => {
      task.order = index + 1;
      this.taskService.updateTask(task).subscribe();
    });
  }

  onFilterChange(filters: { statuses: string[], priorities: string[] }) {
    this.applyFilters(filters);
  }

  applyFilters(filters: { statuses: string[], priorities: string[] }) {
    this.filteredTasks = this.tasks.filter(task =>
      (filters.statuses.length === 0 || filters.statuses.includes(task.status)) &&
      (filters.priorities.length === 0 || filters.priorities.includes(task.priority))
    );
    this.todo = this.filteredTasks.filter(task => task.status === 'todo');
    this.doing = this.filteredTasks.filter(task => task.status === 'doing');
    this.done = this.filteredTasks.filter(task => task.status === 'done');
  }

  onSortChange(sortOption: string): void {
    this.applySort(sortOption);
  }

  applySort(sortOption: string): void {
    switch (sortOption) {
      case 'dueDateAsc':
        this.filteredTasks.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
        break;
      case 'dueDateDesc':
        this.filteredTasks.sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());
        break;
      case 'priorityAsc':
        this.filteredTasks.sort((a, b) => this.priorityToNumber(a.priority) - this.priorityToNumber(b.priority));
        break;
      case 'priorityDesc':
        this.filteredTasks.sort((a, b) => this.priorityToNumber(b.priority) - this.priorityToNumber(a.priority));
        break;
      default:
        break;
    }
    this.todo = this.filteredTasks.filter(task => task.status === 'todo');
    this.doing = this.filteredTasks.filter(task => task.status === 'doing');
    this.done = this.filteredTasks.filter(task => task.status === 'done');
  }

  priorityToNumber(priority: string): number {
    switch (priority.toLowerCase()) {
      case 'low':
        return 1;
      case 'medium':
        return 2;
      case 'high':
        return 3;
      default:
        return 0;
    }
  }
}
