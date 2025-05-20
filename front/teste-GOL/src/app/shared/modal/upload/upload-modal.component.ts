import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  standalone: true,
  imports: [MatIcon,CommonModule],
  selector: 'app-upload-modal',
  templateUrl: './upload-modal.componen.html',
  styleUrls: ['./upload-modal.component.scss']
})
export class UploadModalComponent {
  selectedFile: File | null = null;

  @Output() fileSelected = new EventEmitter<File>();
  @Output() closeModal = new EventEmitter<void>();

  constructor(private snackBar: MatSnackBar) {}

  onFileSelected(event: any) {
    const file = event.target.files?.[0];
    if (file) {
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      if (fileExtension === 'xlsx' || fileExtension === 'xls') {
        this.selectedFile = file;
      } else {
        this.showSnackBar('Por favor, selecione um arquivo Excel (.xlsx ou .xls)', 'error');
      }
    }
  }

  triggerFileInput() {
    const fileInput = document.getElementById('uploadFileInput') as HTMLInputElement;
    fileInput.click();
  }

  onUpload() {
    if (this.selectedFile) {
      this.fileSelected.emit(this.selectedFile);
    }
  }

  private showSnackBar(message: string, type: 'success' | 'error') {
    this.snackBar.open(message, 'Fechar', {
      duration: 5000,
      panelClass: [`${type}-snackbar`],
    });
  }
}
