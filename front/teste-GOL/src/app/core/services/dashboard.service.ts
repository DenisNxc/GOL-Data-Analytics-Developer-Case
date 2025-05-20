import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface DashboardData {
  date: string;
  iatapair: string;
  departures: number;
  arrivals: number;
}

export interface DashboardResponse {
  count: number;
  limit: number;
  data: DashboardData[];
}

export interface ChartDataItem {
  category: string;
  value: number;
}

export interface ChartDataResponse {
  count: number;
  limit: number;
  data: ChartDataItem[];
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
  }[];
}

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getDashboardData(): Observable<DashboardResponse> {
    return this.http.get<DashboardResponse>(
      `${this.apiUrl}/api/v1/dashboard/data?limit=5000`
    );
  }

  getChartData(chartId: number): Observable<ChartDataResponse> {
    return this.http.get<ChartDataResponse>(
      `${this.apiUrl}/api/v1/dashboard/chart/data/${chartId}`
    );
  }

  // Método para transformar dados da API em formato para Chart.js
  transformToChartData(
    response: ChartDataResponse,
    chartType: number
  ): ChartData | null {
    if (
      !response ||
      !response.data ||
      !Array.isArray(response.data) ||
      response.data.length === 0
    ) {
      console.error('Dados inválidos para transformação:', response);
      return null;
    }

    try {
      console.log(
        `Transformando dados para gráfico ${chartType}:`,
        response.data
      );

      // Extrair categorias e valores
      const categories = response.data.map((item) => item.category);
      const values = response.data.map((item) => item.value);

      // Formatar datas para os gráficos 1 e 2 (datas)
      let labels = categories;
      if (chartType === 1 || chartType === 2) {
        labels = categories.map((category) => this.formatChartDate(category));
      }

      // Configurar cores e rótulos com base no tipo de gráfico
      let backgroundColor = '';
      let borderColor = '';
      let label = '';

      switch (chartType) {
        case 1:
          backgroundColor = 'rgba(54, 162, 235, 0.6)';
          borderColor = 'rgba(54, 162, 235, 1)';
          label = 'Partidas';
          break;
        case 2:
          backgroundColor = 'rgba(75, 192, 192, 0.6)';
          borderColor = 'rgba(75, 192, 192, 1)';
          label = 'Chegadas';
          break;
        case 3:
          backgroundColor = 'rgba(255, 159, 64, 0.6)';
          borderColor = 'rgba(255, 159, 64, 1)';
          label = 'Passageiros';
          break;
      }

      return {
        labels: labels,
        datasets: [
          {
            label: label,
            data: values,
            backgroundColor: backgroundColor,
            borderColor: borderColor,
            borderWidth: 1,
          },
        ],
      };
    } catch (error) {
      console.error('Erro ao transformar dados para gráfico:', error);
      return null;
    }
  }

  // Método para formatar data para DD-MM-YYYY
  formatDate(dateString: string): string {
    if (!dateString) return '';

    try {
      // Trata data no formato YYYY-MM-DD
      const parts = dateString.split('-');
      if (parts.length !== 3) return dateString;

      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    } catch (e) {
      console.error('Erro ao formatar data:', e);
      return dateString;
    }
  }

  // Método para formatar data para DD-MM (para gráficos)
formatChartDate(dateString: string): string {
  if (!dateString) return '';

  try {
    // Trata data no formato YYYY-MM-DD
    const parts = dateString.split('-');
    if (parts.length !== 3) return dateString;

    return `${parts[2]}/${parts[1]}`; // Alterado de '-' para '/'
  } catch (e) {
    console.error('Erro ao formatar data para gráfico:', e);
    return dateString;
  }
}
}
