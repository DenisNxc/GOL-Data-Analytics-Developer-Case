// view-mode.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ViewModeService {
  private viewModeSubject = new BehaviorSubject<'grid' | 'table'>('grid');
  viewMode$ = this.viewModeSubject.asObservable();

  setViewMode(mode: 'grid' | 'table') {
    this.viewModeSubject.next(mode);
  }
}
