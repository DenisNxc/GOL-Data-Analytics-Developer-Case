import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chart-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="chart-container">
      <div class="chart-header">
        <h3 class="chart-title">{{ title }}</h3>
      </div>
      <div class="chart-content">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [`
    .chart-container {
      background-color: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      margin-bottom: 20px;
      overflow: hidden;
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .chart-header {
      padding: 16px 20px;
      border-bottom: 1px solid #eee;
      background-color: #f5d3d3
    }

    .chart-title {
      margin: 0;
      font-size: 16px;
      font-weight: 500;
      color: #333;
    }

    .chart-content {
      padding: 16px;
      flex: 1;
      display: flex;
      flex-direction: column;
    }
  `]
})
export class ChartContainerComponent {
  @Input() title: string = '';
}
