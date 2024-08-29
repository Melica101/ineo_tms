import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { Task } from '../../services/task.service';

@Component({
  selector: 'app-task-details',
  standalone: true,
  imports: [FormsModule, QuillModule],
  templateUrl: './task-details.component.html',
  styleUrl: './task-details.component.css'
})
export class TaskDetailsComponent {

  @Input() task!: Task;
  @Output() saveTask = new EventEmitter<Task>();
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
    this.saveTask.emit(this.task);
  }

  onClose() {
    this.closeModal.emit();
  }
}
