import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  private uploadSuccessSource = new Subject<void>();

  uploadSuccess$ = this.uploadSuccessSource.asObservable();

  notifyUploadSuccess(): void {
    this.uploadSuccessSource.next();
  }
}
