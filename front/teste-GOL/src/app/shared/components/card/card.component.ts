import { CommonModule, DatePipe } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  input,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Booking, ModalBookingComponent } from '../../modal/criar-reserva/modal.component';

export type CardMode = 'default' | 'selection';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    ModalBookingComponent,
  ],
  providers: [DatePipe],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
})
export class CardComponent implements OnInit {
  @Input() booking: any;
  showModal: boolean = false;

  private datePipe = inject(DatePipe);

  formattedBirthday: string = '';
  formattedDeparture: string = '';
  formattedArrival: string = '';
  formattedCreated: string = '';
  formattedUpdated: string = '';

  ngOnInit(): void {
    this.formattedBirthday = this.formatDate(this.booking?.birthday);
    this.formattedDeparture = this.formatDateTime(
      this.booking?.departure_date,
      this.booking?.departure_iata
    );
    this.formattedArrival = this.formatDateTime(
      this.booking?.arrival_date,
      this.booking?.arrival_iata
    );
    this.formattedCreated = this.formatDateTime(this.booking?.created_at);
    this.formattedUpdated = this.formatDateTime(this.booking?.updated_at);
  }

  private formatDate(dateString: string): string {
    if (!dateString) return '';
    return this.datePipe.transform(dateString, 'dd/MM/yyyy') || dateString;
  }

  private formatDateTime(dateStr: string, iata?: string): string {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    const formatted = `${date.toLocaleDateString(
      'pt-BR'
    )} ${date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    })}`;
    return iata ? `${formatted} (${iata})` : formatted;
  }

  closeModal() {
    this.showModal = false;
  }
}
