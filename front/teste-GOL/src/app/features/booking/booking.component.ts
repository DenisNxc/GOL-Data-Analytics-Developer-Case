import { Component } from '@angular/core';
import { Booking, BookingService } from '../../core/services/booking.service';
import { ViewModeService } from '../../core/services/view-mode.service';
import { GridComponent } from '../../shared/components/grid/grid.component';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { CommonModule } from '@angular/common';
import { DataTableComponent } from '../../shared/components/data-table-reservas/data-table.component';

@Component({
  selector: 'app-booking',
  standalone: true,
    imports: [
      GridComponent,
      HeaderComponent,
      PaginationComponent,
      CommonModule,
      DataTableComponent,
],
  templateUrl: './booking.component.html'
})
export class BookingComponent {

    currentPage = 1;
    itemsPerPage = 6;
    totalItems = 0;
    viewMode: 'grid' | 'table' = 'grid';
    bookingsForTable: Booking[] = [];

    constructor(private viewModeService: ViewModeService) {
      this.viewModeService.viewMode$.subscribe(mode => {
        this.viewMode = mode;
        this.currentPage = 1; // Resetar página ao mudar de visualização
      });
    }

    onPageChange(page: number): void {
      this.currentPage = page;
    }

    updateTotalItems(total: number): void {
      this.totalItems = total;
    }

    onBookingsChange(bookings: Booking[]) {
    this.bookingsForTable = bookings;
    this.updateTotalItems(bookings.length);
  }
}
