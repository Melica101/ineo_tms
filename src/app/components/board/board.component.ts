import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../card/card.component';
import { Task, TaskService } from '../../services/task.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';
import { TaskDetailsComponent } from '../task-details/task-details.component';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, CardComponent, DragDropModule, FormsModule, TaskDetailsComponent],
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent {
  // tasks: Task[] = [];

  // constructor(private taskService: TaskService) {}

  // ngOnInit(): void {
  //   this.loadTasks();
  // }

  // loadTasks(): void {
  //   this.taskService.getTasks().subscribe(
  //     (data) => {
  //       this.tasks = data;
  //     },
  //     (error) => {
  //       console.error('Failed to fetch tasks', error);
  //     }
  //   );
  // }

  // setCards(updatedCards: any[]) {
  //   this.tasks = updatedCards;
  // }
  todo: Task[] = [];
  doing: Task[] = [];
  done: Task[] = [];

  newTaskTitle = '';
  newTaskDescription = '';
  newTaskPriority: 'low' | 'medium' | 'high' = 'medium'; // Default priority
  newTaskDueDate = ''; // Due date as a string in ISO format
  editingTask: Task | null = null;
  showModal = false;
  selectedTask: Task | null = null;

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe(tasks => {
      this.todo = tasks.filter(task => task.status === 'todo');
      this.doing = tasks.filter(task => task.status === 'doing');
      this.done = tasks.filter(task => task.status === 'done');
    });
  }

  addTask(status: 'todo' | 'doing' | 'done'): void {
    if (this.newTaskTitle && this.newTaskDescription) {
      const newTask: Task = {
        id: 0, // This will be set by the server
        title: this.newTaskTitle,
        description: this.newTaskDescription,
        status,
        priority: this.newTaskPriority,
        dueDate: this.newTaskDueDate,
        order: this.taskService.generateNewTaskOrder(
          status === 'todo' ? this.todo : status === 'doing' ? this.doing : this.done
        ),
      };

      this.taskService.createTask(newTask).subscribe(() => {
        this.loadTasks();
        this.newTaskTitle = '';
        this.newTaskDescription = '';
        this.newTaskPriority = 'medium';
        this.newTaskDueDate = '';
      });
    }
  }

  openTaskDetails(task: Task): void {
    this.selectedTask = { ...task };
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


  deleteTask(taskId: number): void {
    this.taskService.deleteTask(taskId).subscribe(() => {
      this.loadTasks();
    });
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
}
