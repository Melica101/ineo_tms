import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-drop-indicator',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './drop-indicator.component.html',
  styleUrls: ['./drop-indicator.component.css'],
})
export class DropIndicatorComponent {
  @Input() beforeId: string | null = null;  // Default value provided
  @Input() column!: string;  // Using definite assignment
}
