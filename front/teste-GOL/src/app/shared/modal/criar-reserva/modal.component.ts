import { CommonModule } from '@angular/common';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BookingService } from '../../../core/services/booking.service';
import { NotificationService } from '../../../core/services/notification.service';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';

export type ModalMode = 'create';

export interface Booking {
  id: number;
  first_name: string;
  last_name: string;
  birthday: string;
  document: string;
  departure_date: string;
  departure_iata: string;
  arrival_iata: string;
  arrival_date: string;
  created_at: string;
  updated_at: string;
}

@Component({
  selector: 'app-modal-booking',
  standalone: true,
  imports: [    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMaskDirective,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule
],
  providers: [provideNgxMask()],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalBookingComponent {
  @Input() bookingData: Booking | null = null;
  @Input() mode: ModalMode = 'create';
  @Output() closeModal = new EventEmitter<void>();
  @Output() saveBooking = new EventEmitter<Booking>();

  private notificationService = inject(NotificationService);

  formData: {
    first_name: string;
    last_name: string;
    birthday: string;
    document: string;
    departure_date: string;
    departure_iata: string;
    arrival_iata: string;
    arrival_date: string;
  } = {
    first_name: '',
    last_name: '',
    birthday: '',
    document: '',
    departure_date: '',
    departure_iata: '',
    arrival_iata: '',
    arrival_date: '',
  };

  modalTitle = 'Criar Reserva';
  submitButtonText = 'Criar Reserva';
  confirmationMessage = '';

  private bookingService = inject(BookingService);

  ngOnInit(): void {
    this.initializeModal();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['bookingData']) {
      this.initializeModal();
    }
  }

  initializeModal(): void {
    this.mode = 'create';
    this.modalTitle = 'Criar reserva:';
    this.submitButtonText = 'Criar reserva';
    this.formData = {
      first_name: '',
      last_name: '',
      birthday: '',
      document: '',
      departure_date: '',
      departure_iata: '',
      arrival_iata: '',
      arrival_date: '',
    };
    this.bookingData = null;
    this.confirmationMessage = '';
  }

  onClose(): void {
    this.closeModal.emit();
  }

  onSubmit(): void {
    if (this.mode === 'create') {
      if (
        !this.formData.first_name ||
        !this.formData.last_name ||
        !this.formData.birthday ||
        !this.formData.document ||
        !this.formData.departure_date ||
        !this.formData.departure_iata ||
        !this.formData.arrival_iata ||
        !this.formData.arrival_date
      ) {
        this.notificationService.showError(
          'Preencha todos os campos obrigatórios'
        );
        return;
      }

      const bookingPayload: Booking = {
        first_name: this.formData.first_name.trim(),
        last_name: this.formData.last_name.trim(),
        birthday: this.convertDateFormat(this.formData.birthday),
        document: this.formData.document.trim(),
        departure_date: this.convertDateFormat(this.formData.departure_date),
        departure_iata: this.formData.departure_iata.trim(),
        arrival_iata: this.formData.arrival_iata.trim(),
        arrival_date: this.convertDateFormat(this.formData.arrival_date),
        id: this.bookingData?.id || 0,
        created_at: '',
        updated_at: '',
      };

      if (this.mode === 'create') {
        this.bookingService.create(bookingPayload).subscribe({
          next: (newBooking) => {
            this.saveBooking.emit(newBooking);
            this.notificationService.showSuccess('Reserva criada com sucesso!');
            this.onClose();
          },
          error: (err) => {
            console.error('Erro ao criar reserva:', err);
            this.notificationService.showError(
              'Erro ao criar reserva. Por favor, tente novamente.'
            );
          },
        });
      }
    }
  }

  private convertDateFormat(dateString: string): string {
    if (!dateString) return '';

    // Remove todas as barras caso existam
    const cleanDate = dateString.replace(/\D/g, '');

    // Verifica se tem 8 dígitos (ddmmyyyy)
    if (cleanDate.length === 8) {
      const day = cleanDate.substring(0, 2);
      const month = cleanDate.substring(2, 4);
      const year = cleanDate.substring(4, 8);
      return `${year}-${month}-${day}`;
    }

    console.warn('Formato de data inválido:', dateString);
    return dateString;
  }
}
