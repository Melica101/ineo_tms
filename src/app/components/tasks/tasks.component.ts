import { Component } from '@angular/core';
import { BoardComponent } from '../board/board.component';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [BoardComponent, HeaderComponent],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css'
})
export class TasksComponent {

}
