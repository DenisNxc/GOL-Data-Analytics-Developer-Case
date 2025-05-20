import { Component, OnInit } from '@angular/core';
import { SideNavigationComponent } from '../side-nav/side-nav.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, NavigationEnd } from '@angular/router'; // Adicione NavigationEnd
import { filter } from 'rxjs/operators'; // Adicione esta importação
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BookingService } from '../../../core/services/booking.service';
import { CommonModule } from '@angular/common';
import { EventService } from '../../../core/services/event.service';
import { ViewModeService } from '../../../core/services/view-mode.service';
import { UploadModalComponent } from '../../modal/upload/upload-modal.component';

@Component({
  selector: 'app-header',
  imports: [
    SideNavigationComponent,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatSnackBarModule,
    CommonModule,
    UploadModalComponent
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  isSideNavOpen = false;
  usuarioNome: string = '';
  selectedFile: File | null = null;
  viewMode: 'grid' | 'table' = 'grid';
  currentRoute: string = '';
  showUploadModal: boolean = false;


  constructor(
    private bookingService: BookingService,
    private snackBar: MatSnackBar,
    private viewModeService: ViewModeService,
    private eventService: EventService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Atualiza imediatamente com a rota atual
    this.currentRoute = this.router.url.split('?')[0];
    console.log('Rota atual:', this.currentRoute);

    // Observa as mudanças de rota
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentRoute = event.url.split('?')[0];
      });
  }

  toggleSideNav() {
    this.isSideNavOpen = !this.isSideNavOpen;
  }

  onSideNavClosed() {
    this.isSideNavOpen = false;
  }

  onFileSelected(event: any) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  onFileUpload(file: File): void {
  this.selectedFile = file;
  this.uploadFile();
  this.showUploadModal = false; // Fecha o modal após selecionar o arquivo
}

  downloadFile() {
    this.bookingService.download().subscribe(
      (blob: Blob) => {
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = 'bookings.xlsx';
        link.click();
        window.URL.revokeObjectURL(downloadUrl);
        this.snackBar.open('Download completed successfully!', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar'],
        });
      },
      (error) => {
        this.snackBar.open('Error downloading file', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar'],
        });
      }
    );
  }

  triggerFileInput(): void {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.click();
  }

  uploadFile(): void {
    if (!this.selectedFile) {
      this.showSnackBar('Por favor, selecione um arquivo primeiro', 'error');
      return;
    }

    const fileExtension = this.selectedFile.name
      .split('.')
      .pop()
      ?.toLowerCase();
    if (fileExtension !== 'xlsx' && fileExtension !== 'xls') {
      this.showSnackBar(
        'Por favor, selecione um arquivo Excel (.xlsx ou .xls)',
        'error'
      );
      return;
    }

    this.bookingService.upload(this.selectedFile).subscribe({
      next: () => {
        this.showSnackBar('Arquivo enviado com sucesso!', 'success');
        this.resetFileInput();
        // Notificar outros componentes sobre o upload bem-sucedido
        this.eventService.notifyUploadSuccess();
      },
      error: () => {
        this.showSnackBar('Erro ao enviar arquivo', 'error');
      },
    });
  }

  private resetFileInput(): void {
    this.selectedFile = null;
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  private showSnackBar(message: string, type: 'success' | 'error'): void {
    this.snackBar.open(message, 'Fechar', {
      duration: 5000,
      panelClass: [`${type}-snackbar`],
    });
  }

  changeViewMode(mode: 'grid' | 'table') {
    this.viewMode = mode;
    console.log(this.viewModeService)
    this.viewModeService.setViewMode(mode);
  }
}
