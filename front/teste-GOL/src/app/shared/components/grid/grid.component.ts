import { BookingService } from './../../../core/services/booking.service';
import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CardComponent } from '../card/card.component';
import {
  Booking,
  ModalBookingComponent,
  ModalMode,
} from '../../modal/criar-reserva/modal.component';
import { Subscription } from 'rxjs';
import { EventService } from '../../../core/services/event.service';

@Component({
  selector: 'app-grid',
  standalone: true,
  imports: [CommonModule, FormsModule, CardComponent, ModalBookingComponent],
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.scss',
})
export class GridComponent implements OnInit, OnDestroy, OnChanges {
  @Input() mode: 'default' = 'default';
  @Input() currentPage: number = 1;
  @Input() itemsPerPage: number = 6;

  @Output() bookingsChange = new EventEmitter<Booking[]>();
  @Output() totalItemsChange = new EventEmitter<number>();

  modalMode: ModalMode = 'create';
  showModal = false;
  bookingCards: Booking[] = [];
  displayedBookingCards: Booking[] = [];
  selectedBooking: Booking | null = null;

  private bookingService = inject(BookingService);
  private eventService = inject(EventService);
  private uploadSubscription: Subscription = new Subscription();

  ngOnInit(): void {
    this.loadBooking();

    this.uploadSubscription = this.eventService.uploadSuccess$.subscribe(() => {
      console.log('Upload bem-sucedido detectado, atualizando grid...');
      this.loadBooking();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['currentPage'] || changes['itemsPerPage']) {
      this.updateDisplayedCards();
    }
  }

  ngOnDestroy(): void {
    // Cancelar a assinatura para evitar memory leaks
    if (this.uploadSubscription) {
      this.uploadSubscription.unsubscribe();
    }
  }

  updateDisplayedCards(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = Math.min(
      startIndex + this.itemsPerPage,
      this.bookingCards.length
    );
    this.displayedBookingCards = this.bookingCards.slice(startIndex, endIndex);
  }

  openModalForCreate(): void {
    this.modalMode = 'create';
    this.showModal = true;
  }

  handleCloseModal(): void {
    this.showModal = false;
  }

  loadBooking() {
    this.bookingService.getAll().subscribe({
      next: (response) => {
        this.bookingCards = response.data;
        console.log('Bookings carregados:', this.bookingCards);
        this.totalItemsChange.emit(this.bookingCards.length);
        this.updateDisplayedCards();
      },
      error: (err) => {
        console.error('Erro ao carregar bookings:', err);
      },
    });
    this.bookingsChange.emit(this.bookingCards);
  }

  handleBookingSaved(booking: Booking): void {
    this.loadBooking();
    this.showModal = false;
  }
}
