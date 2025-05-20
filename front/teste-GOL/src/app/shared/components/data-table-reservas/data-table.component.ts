import {
  Component,
  inject,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
  AfterViewInit,
  OnInit,
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import {
  Booking,
  ModalBookingComponent,
  ModalMode,
} from '../../modal/criar-reserva/modal.component';
import { BookingService } from '../../../core/services/booking.service';
import { FormsModule } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ModalBookingComponent,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  providers: [DatePipe],
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
})
export class DataTableComponent implements OnInit, AfterViewInit {
  @Input() mode: 'default' | 'readonly' = 'default';

  displayedBookings = new MatTableDataSource<Booking>();
  displayedColumns: string[] = [
    'name',
    'document',
    'birthday',
    'departure_date',
    'departure_iata',
    'arrival_date',
    'arrival_iata',
  ];
  itemsPerPage = 20;
  modalMode: ModalMode = 'create';
  showModal = false;
  bookings: Booking[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private bookingService = inject(BookingService);
  private datePipe = inject(DatePipe);

  ngOnInit(): void {
    this.displayedBookings = new MatTableDataSource<Booking>();
    this.loadBookings();
  }

  ngAfterViewInit(): void {
    this.displayedBookings.paginator = this.paginator;
    this.displayedBookings.sort = this.sort;

      this.displayedBookings.sortingDataAccessor = (item, property) => {
    switch (property) {
      case 'name':
        return `${item.first_name} ${item.last_name}`.toLowerCase();
      default:
        return (item as any)[property];
    }
  };

  }

  loadBookings(): void {
    this.bookingService.getAll().subscribe({
      next: (response) => {
        const processed = response.data.map((booking) => ({
          ...booking,
          first_name: this.truncateName(booking.first_name),
          last_name: this.truncateName(booking.last_name),
          birthday: this.formatDate(booking.birthday),
          departure_date: this.formatDate(booking.departure_date),
          arrival_date: this.formatDate(booking.arrival_date),
        }));
        this.bookings = processed;
        this.displayedBookings.data = processed;
      },
      error: (err) => {
        console.error('Erro ao carregar bookings:', err);
      },
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.displayedBookings.filter = filterValue.trim().toLowerCase();
  }

  onPageChange(event: PageEvent): void {
    this.itemsPerPage = event.pageSize;
    this.paginator.pageIndex = event.pageIndex;
  }

  openModalForCreate(): void {
    this.modalMode = 'create';
    this.showModal = true;
  }

  handleBookingSaved(booking: Booking): void {
    this.loadBookings(); // recarrega tudo
    this.showModal = false;
  }

  handleCloseModal(): void {
    this.showModal = false;
  }

  private formatDate(dateString: string): string {
    if (!dateString) return '';
    return this.datePipe.transform(dateString, 'dd/MM/yyyy') || dateString;
  }

  private truncateName(name: string, maxLength: number = 15): string {
    if (!name) return '';
    return name.length > maxLength
      ? `${name.substring(0, maxLength)}...`
      : name;
  }
}
