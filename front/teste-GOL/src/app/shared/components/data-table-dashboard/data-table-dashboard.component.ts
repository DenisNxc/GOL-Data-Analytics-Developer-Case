import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { DashboardService } from '../../../core/services/dashboard.service';

@Component({
  selector: 'app-dashboard-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
  ],
  providers: [DatePipe],
  templateUrl: './data-table-dashboard.component.html',
  styleUrls: ['./data-table-dashboard.component.scss'],
})
export class DashboardTableComponent implements OnInit {
  displayedData = new MatTableDataSource<any>([]);
  originalData: any[] = []; // Armazenaremos os dados originais aqui
  displayedColumns: string[] = ['date', 'iatapair', 'departures', 'arrivals'];
  isLoading = true;
  itemsPerPage = 5;
  currentPage = 0;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private dashboardService: DashboardService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.loadTableData();
  }

  loadTableData(): void {
    this.isLoading = true;
    this.dashboardService.getDashboardData().subscribe({
      next: (response) => {
        if (response && response.data) {
          this.originalData = response.data.map((item) => ({
            ...item,
            date: this.formatDate(item.date),
          }));
          this.updatePaginatedData();
          this.displayedData.sort = this.sort;
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar dados da tabela:', err);
        this.isLoading = false;
      },
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.displayedData.filter = filterValue.trim().toLowerCase();

    // Atualiza os dados paginados após filtrar
    if (this.displayedData.filteredData) {
      this.originalData = this.displayedData.filteredData;
      this.updatePaginatedData();
    }
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.itemsPerPage = event.pageSize;
    this.updatePaginatedData();
  }

  private updatePaginatedData(): void {
    const startIndex = this.currentPage * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    const paginatedData = this.originalData.slice(startIndex, endIndex);
    this.displayedData.data = paginatedData;
  }

  private formatDate(dateString: string): string {
    if (!dateString) return '';
    return this.datePipe.transform(dateString, 'dd/MM/yyyy') || dateString;
  }
}
