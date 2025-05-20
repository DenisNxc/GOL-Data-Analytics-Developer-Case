import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { Router } from '@angular/router';
import { HostListener } from '@angular/core';

@Component({
  selector: 'app-side-navigation',
  imports: [CommonModule, MatIconModule, MatRippleModule],
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.scss',
})
export class SideNavigationComponent {
  @Input() isOpen: boolean = false; // Recebe do componente pai

  @Output() menuClosed: EventEmitter<void> = new EventEmitter<void>();

  activeItem: string = '';

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.side-navigation-container') && this.isOpen) {
      this.onCollapseClick();
    }
  }

  constructor(private router: Router) {
    this.activeItem  = this.router.url.split('/')[1] || 'dashboard';
  }

  onCollapseClick(): void {
    this.isOpen = false;
    this.menuClosed.emit();
  }

  setActiveItem(item: string) {
    this.activeItem = item;
    if (item === 'reservas') {
      this.router.navigate(['/reservas']);
    } else if (item === 'dashboard') {
      this.router.navigate(['/dashboard']);
    }
  }
}
