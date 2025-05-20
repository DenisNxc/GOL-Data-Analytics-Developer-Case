import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss'
})
export class PaginationComponent implements OnChanges {
  @Input() totalItems: number = 0;
  @Input() itemsPerPage: number = 6;
  @Input() currentPage: number = 1;

  @Output() pageChange = new EventEmitter<number>();

  totalPages: number = 0;
  pages: number[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    this.calculatePages();
  }

  calculatePages(): void {
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);

    // Gerar array de páginas
    this.pages = [];

    // Lógica para exibir no máximo 5 páginas com "..." quando necessário
    if (this.totalPages <= 5) {
      // Se tiver 5 ou menos páginas, mostrar todas
      for (let i = 1; i <= this.totalPages; i++) {
        this.pages.push(i);
      }
    } else {
      // Se tiver mais de 5 páginas, mostrar com "..."
      if (this.currentPage <= 3) {
        // Caso 1: Página atual próxima do início
        this.pages = [1, 2, 3, 4, -1, this.totalPages];
      } else if (this.currentPage >= this.totalPages - 2) {
        // Caso 2: Página atual próxima do fim
        this.pages = [1, -1, this.totalPages - 3, this.totalPages - 2, this.totalPages - 1, this.totalPages];
      } else {
        // Caso 3: Página atual no meio
        this.pages = [1, -1, this.currentPage - 1, this.currentPage, this.currentPage + 1, -1, this.totalPages];
      }
    }
  }

  goToPage(page: number): void {
    if (page !== -1 && page !== this.currentPage) {
      this.pageChange.emit(page);
    }
  }

  goToPrevious(): void {
    if (this.currentPage > 1) {
      this.pageChange.emit(this.currentPage - 1);
    }
  }

  goToNext(): void {
    if (this.currentPage < this.totalPages) {
      this.pageChange.emit(this.currentPage + 1);
    }
  }

  isActive(page: number): boolean {
    return page === this.currentPage;
  }
}
