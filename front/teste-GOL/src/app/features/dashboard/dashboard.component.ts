import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  DashboardService,
  DashboardData,
  ChartData,
} from '../../core/services/dashboard.service';
import { NotificationService } from '../../core/services/notification.service';
import { ChartComponent } from '../../shared/components/chart/chart.component';
import { ChartContainerComponent } from '../../shared/components/chart/chat-container.component';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { DashboardTableComponent } from '../../shared/components/data-table-dashboard/data-table-dashboard.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HeaderComponent,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    ChartComponent,
    ChartContainerComponent,
    DashboardTableComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  displayedColumns: string[] = ['iatapair', 'date', 'departures', 'arrivals'];
  dataSource = new MatTableDataSource<DashboardData>([]);
  isLoading = true;
  error = false;

  chartData1: ChartData | null = null;
  chartData2: ChartData | null = null;
  chartData3: ChartData | null = null;

  chartLoading1 = true;
  chartLoading2 = true;
  chartLoading3 = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private dashboardService: DashboardService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
    this.loadChartData();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadDashboardData(): void {
    this.isLoading = true;
    this.dashboardService.getDashboardData().subscribe({
      next: (response) => {
        // Verificar se response e response.data existem
        if (response && response.data) {
          // Formatar as datas antes de exibir na tabela
          const formattedData = response.data.map((item) => ({
            ...item,
            date: this.dashboardService.formatDate(item.date),
          }));

          this.dataSource.data = formattedData;
          this.notificationService.showSuccess(
            'Dados do dashboard carregados com sucesso'
          );
        } else {
          console.error('Resposta da API inválida:', response);
          this.error = true;
          this.notificationService.showError('Formato de dados inválido');
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar dados do dashboard:', err);
        this.isLoading = false;
        this.error = true;
        this.notificationService.showError(
          'Erro ao carregar dados do dashboard'
        );
      },
    });
  }

  loadChartData(): void {
    // Carregar dados para o gráfico 1: Partidas de passageiros por data
    this.chartLoading1 = true;
    this.dashboardService.getChartData(1).subscribe({
      next: (response) => {
        // Transformar os dados para o formato do Chart.js
        const chartData = this.dashboardService.transformToChartData(
          response,
          1
        );

        if (chartData) {
          this.chartData1 = chartData;
          console.log('Dados do gráfico 1 transformados:', this.chartData1);
        } else {
          console.error(
            'Não foi possível transformar os dados do gráfico 1:',
            response
          );
          this.notificationService.showWarning(
            'Não foi possível carregar o gráfico de partidas'
          );
        }
        this.chartLoading1 = false;
      },
      error: (err) => {
        console.error('Erro ao carregar dados do gráfico 1:', err);
        this.notificationService.showError(
          'Erro ao carregar dados do gráfico de partidas'
        );
        this.chartLoading1 = false;
      },
    });

    // Carregar dados para o gráfico 2: Chegadas de passageiros por data
    this.chartLoading2 = true;
    this.dashboardService.getChartData(2).subscribe({
      next: (response) => {
        // Transformar os dados para o formato do Chart.js
        const chartData = this.dashboardService.transformToChartData(
          response,
          2
        );

        if (chartData) {
          this.chartData2 = chartData;
          console.log('Dados do gráfico 2 transformados:', this.chartData2);
        } else {
          console.error(
            'Não foi possível transformar os dados do gráfico 2:',
            response
          );
          this.notificationService.showWarning(
            'Não foi possível carregar o gráfico de chegadas'
          );
        }
        this.chartLoading2 = false;
      },
      error: (err) => {
        console.error('Erro ao carregar dados do gráfico 2:', err);
        this.notificationService.showError(
          'Erro ao carregar dados do gráfico de chegadas'
        );
        this.chartLoading2 = false;
      },
    });

    // Carregar dados para o gráfico 3: Número de passageiros por rota
    this.chartLoading3 = true;
    this.dashboardService.getChartData(3).subscribe({
      next: (response) => {
        // Transformar os dados para o formato do Chart.js
        const chartData = this.dashboardService.transformToChartData(
          response,
          3
        );

        if (chartData) {
          this.chartData3 = chartData;
          console.log('Dados do gráfico 3 transformados:', this.chartData3);
        } else {
          console.error(
            'Não foi possível transformar os dados do gráfico 3:',
            response
          );
          this.notificationService.showWarning(
            'Não foi possível carregar o gráfico de rotas'
          );
        }
        this.chartLoading3 = false;
      },
      error: (err) => {
        console.error('Erro ao carregar dados do gráfico 3:', err);
        this.notificationService.showError(
          'Erro ao carregar dados do gráfico de rotas'
        );
        this.chartLoading3 = false;
      },
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  refresh(): void {
    this.loadDashboardData();
    this.loadChartData();
    this.notificationService.showInfo('Atualizando dados do dashboard');
  }
}
