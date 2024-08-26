import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColumnComponent } from '../column/column.component';
import { DEFAULT_CARDS } from '../default-cards';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, ColumnComponent],
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css'],
})
export class BoardComponent {
  cards = DEFAULT_CARDS;

  setCards(updatedCards: any[]) {
    this.cards = updatedCards;
  }
}
