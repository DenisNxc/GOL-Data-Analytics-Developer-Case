import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private snackBar: MatSnackBar) {}

  /**
   * Exibe uma notificação de sucesso
   * @param message Mensagem a ser exibida
   * @param duration Duração em milissegundos (padrão: 3000ms)
   */
  showSuccess(message: string, duration: number = 3000): void {
    this.snackBar.open(message, 'Fechar', {
      duration: duration,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['success-snackbar'],
    });
  }

  /**
   * Exibe uma notificação de erro
   * @param message Mensagem a ser exibida
   * @param duration Duração em milissegundos (padrão: 5000ms)
   */
  showError(message: string, duration: number = 5000): void {
    this.snackBar.open(message, 'Fechar', {
      duration: duration,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['error-snackbar'],
    });
  }

  /**
   * Exibe uma notificação de aviso
   * @param message Mensagem a ser exibida
   * @param duration Duração em milissegundos (padrão: 4000ms)
   */
  showWarning(message: string, duration: number = 4000): void {
    this.snackBar.open(message, 'Fechar', {
      duration: duration,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['warning-snackbar'],
    });
  }

  /**
   * Exibe uma notificação informativa
   * @param message Mensagem a ser exibida
   * @param duration Duração em milissegundos (padrão: 3000ms)
   */
  showInfo(message: string, duration: number = 3000): void {
    this.snackBar.open(message, 'Fechar', {
      duration: duration,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['info-snackbar'],
    });
  }
}
