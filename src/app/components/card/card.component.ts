import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropIndicatorComponent } from '../drop-indicator/drop-indicator.component';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule, DropIndicatorComponent],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
})
export class CardComponent {
  @Input() title!: string;
  @Input() id!: string;
  @Input() column!: string;
  @Input() priority!: string;

  loading = false;

  handleDragStart(event: DragEvent) {
    event.dataTransfer?.setData('cardId', this.id);
  }
}
