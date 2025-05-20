import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.scss',
})
export class ChartComponent implements  OnChanges {
  @Input() chartData: any;
  @Input() chartType: 'bar' | 'line' | 'pie' = 'bar';
  @Input() chartHeight: number = 300;
  @Input() chartOptions: any = {};

  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;

  private chart: Chart | null = null;

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {

    if (changes['chartData'] && this.chartData) {
      if (this.chart) {
        this.chart.destroy();
      }

      setTimeout(() => {
        this.createChart();
      });
    }
  }

  private createChart(): void {
    if (!this.chartCanvas || !this.chartData) {
      return;
    }

    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) {
      return;
    }

    const defaultOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top' as const,
        },
        tooltip: {
          mode: 'index',
          intersect: false,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            precision: 0,
          },
        },
      },
    };

    const options = { ...defaultOptions, ...this.chartOptions };

    this.chart = new Chart(ctx, {
      type: this.chartType,
      data: this.chartData,
      options: options,
    });
  }

  updateChart(newData: any): void {
    if (this.chart && newData) {
      this.chart.data = newData;
      this.chart.update();
    }
  }

  resizeChart(): void {
    if (this.chart) {
      this.chart.resize();
    }
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }
}
