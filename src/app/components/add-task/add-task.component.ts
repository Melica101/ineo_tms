import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [FormsModule, QuillModule],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.css'
})
export class AddTaskComponent {
  taskTitle: string = '';
  taskDescription: string = '';

  @Output() taskAdded = new EventEmitter<{ title: string; description: string }>();
  @Output() modalClosed = new EventEmitter<void>();

  editorModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline'],
      ['link', 'image'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ 'align': [] }],
      ['clean']
    ]
  };

  addTask() {
    if (this.taskTitle && this.taskDescription) {
      this.taskAdded.emit({
        title: this.taskTitle,
        description: this.taskDescription
      });
      this.closeModal();
    }
  }

  closeModal() {
    this.modalClosed.emit();
  }
}
