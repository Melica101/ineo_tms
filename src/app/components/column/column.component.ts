import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../card/card.component';
import { DropIndicatorComponent } from '../drop-indicator/drop-indicator.component';

@Component({
  selector: 'app-column',
  standalone: true,
  imports: [CommonModule, CardComponent, DropIndicatorComponent],
  templateUrl: './column.component.html',
  styleUrls: ['./column.component.css'],
})
export class ColumnComponent {
  @Input() title!: string;
  @Input() headingColor!: string;
  @Input() cards!: any[];
  @Input() column!: string;
  @Output() updateCards = new EventEmitter<any[]>();

  active = false;

  get filteredCards() {
    return this.cards.filter((c) => c.column === this.column);
  }

  setCards(updatedCards: any[]) {
    this.updateCards.emit(updatedCards);
  }

  handleDragStart(event: DragEvent, card: any) {
    event.dataTransfer?.setData('cardId', card.id);
  }

  handleDragEnd(event: DragEvent) {
    const cardId = event.dataTransfer?.getData('cardId');

    this.active = false;
    this.clearHighlights();

    const indicators = this.getIndicators();
    const { element } = this.getNearestIndicator(event, indicators);

    const before = element?.dataset?.before || '-1';

    if (before !== cardId) {
      let copy = [...this.cards];

      let cardToTransfer = copy.find((c) => c.id === cardId);
      if (!cardToTransfer) return;
      cardToTransfer = { ...cardToTransfer, column: this.column };

      copy = copy.filter((c) => c.id !== cardId);

      const moveToBack = before === '-1';

      if (moveToBack) {
        copy.push(cardToTransfer);
      } else {
        const insertAtIndex = copy.findIndex((el) => el.id === before);
        if (insertAtIndex === undefined) return;

        copy.splice(insertAtIndex, 0, cardToTransfer);
      }

      this.updateCards.emit(copy);
    }
  }

  handleDragOver(event: DragEvent) {
    event.preventDefault();
    this.highlightIndicator(event);
    this.active = true;
  }

  handleDragLeave() {
    this.clearHighlights();
    this.active = false;
  }

  clearHighlights() {
    const indicators = this.getIndicators();
    indicators.forEach((i) => {
      i.style.opacity = '0';
    });
  }

  highlightIndicator(event: DragEvent) {
    const indicators = this.getIndicators();

    this.clearHighlights();

    const el = this.getNearestIndicator(event, indicators);
    el.element.style.opacity = '1';
  }

  getNearestIndicator(event: DragEvent, indicators: HTMLElement[]) {
    const DISTANCE_OFFSET = 50;

    return indicators.reduce(
      (closest: any, child: HTMLElement) => {
        const box = child.getBoundingClientRect();
        const offset = event.clientY - (box.top + DISTANCE_OFFSET);

        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      },
      {
        offset: Number.NEGATIVE_INFINITY,
        element: indicators[indicators.length - 1],
      }
    );
  }

  getIndicators(): HTMLElement[] {
    return Array.from(document.querySelectorAll(`[data-column="${this.column}"]`)) as HTMLElement[];
  }
}
