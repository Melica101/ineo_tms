import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { Task } from '../../services/task.service';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [FormsModule, QuillModule],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.css'
})
export class AddTaskComponent {
  newTask: Partial<Task> = {
    title: '',
    description: '',
    status: 'todo', // Default status
    order: 0, // This will be set by the board component
    priority: 'medium', // Default priority
    dueDate: '', // Default to empty string
  };

  @Output() saveTask = new EventEmitter<Partial<Task>>();
  @Output() closeModal = new EventEmitter<void>();

  editorModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline'],
      ['link', 'image'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ 'align': [] }]
    ]
  };

  onSave() {
    this.saveTask.emit(this.newTask);
  }

  onClose() {
    this.closeModal.emit();
  }


}
