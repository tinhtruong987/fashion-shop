import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { FormsModule } from '@angular/forms';

interface SalesData {
  date: string;
  sales: number;
  orders: number;
  revenue: number;
}

interface TopProduct {
  name: string;
  quantity: number;
  revenue: number;
  category: string;
}

@Component({
  selector: 'app-sales-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    ChartModule,
    TableModule,
    ButtonModule,
    CalendarModule,
    DropdownModule,
    TagModule,
  ],
  template: `
    <div class="sales-dashboard p-4">
      <div class="flex justify-content-between align-items-center mb-4">
        <h2 class="m-0">Dashboard Bán Hàng</h2>
        <div class="flex gap-3 align-items-center">
          <p-calendar 
            [(ngModel)]="selectedDate" 
            dateFormat="dd/mm/yy"
            placeholder="Chọn ngày"
            [showIcon]="true">
          </p-calendar>
          <p-dropdown 
            [options]="periodOptions" 
            [(ngModel)]="selectedPeriod"
            placeholder="Chọn kỳ"
            (onChange)="onPeriodChange()">
          </p-dropdown>
          <p-button 
            label="Xuất báo cáo" 
            icon="pi pi-download" 
            severity="secondary"
            (onClick)="exportReport()">
          </p-button>
        </div>
      </div>

      <!-- Summary Cards -->
      <div class="grid mb-4">
        <div class="col-12 md:col-3">
          <p-card>
            <div class="flex align-items-center">
              <div class="flex-1">
                <div class="text-500 font-medium mb-1">Doanh thu hôm nay</div>
                <div class="text-2xl font-bold text-primary">
                  {{ todayRevenue | currency : 'VND' : 'symbol' : '1.0-0' }}
                </div>
                <div class="text-sm" [class.text-green-500]="revenueGrowth >= 0" [class.text-red-500]="revenueGrowth < 0">
                  <i class="pi" [class.pi-arrow-up]="revenueGrowth >= 0" [class.pi-arrow-down]="revenueGrowth < 0"></i>
                  {{ Math.abs(revenueGrowth) }}% so với hôm qua
                </div>
              </div>
              <div class="bg-primary border-round flex align-items-center justify-content-center" style="width: 3rem; height: 3rem">
                <i class="pi pi-dollar text-white text-xl"></i>
              </div>
            </div>
          </p-card>
        </div>

        <div class="col-12 md:col-3">
          <p-card>
            <div class="flex align-items-center">
              <div class="flex-1">
                <div class="text-500 font-medium mb-1">Đơn hàng hôm nay</div>
                <div class="text-2xl font-bold text-blue-500">{{ todayOrders }}</div>
                <div class="text-sm" [class.text-green-500]="ordersGrowth >= 0" [class.text-red-500]="ordersGrowth < 0">
                  <i class="pi" [class.pi-arrow-up]="ordersGrowth >= 0" [class.pi-arrow-down]="ordersGrowth < 0"></i>
                  {{ Math.abs(ordersGrowth) }}% so với hôm qua
                </div>
              </div>
              <div class="bg-blue-500 border-round flex align-items-center justify-content-center" style="width: 3rem; height: 3rem">
                <i class="pi pi-shopping-cart text-white text-xl"></i>
              </div>
            </div>
          </p-card>
        </div>

        <div class="col-12 md:col-3">
          <p-card>
            <div class="flex align-items-center">
              <div class="flex-1">
                <div class="text-500 font-medium mb-1">Khách hàng mới</div>
                <div class="text-2xl font-bold text-green-500">{{ newCustomers }}</div>
                <div class="text-sm text-500">Trong tuần này</div>
              </div>
              <div class="bg-green-500 border-round flex align-items-center justify-content-center" style="width: 3rem; height: 3rem">
                <i class="pi pi-users text-white text-xl"></i>
              </div>
            </div>
          </p-card>
        </div>

        <div class="col-12 md:col-3">
          <p-card>
            <div class="flex align-items-center">
              <div class="flex-1">
                <div class="text-500 font-medium mb-1">Giá trị đơn TB</div>
                <div class="text-2xl font-bold text-orange-500">
                  {{ averageOrderValue | currency : 'VND' : 'symbol' : '1.0-0' }}
                </div>
                <div class="text-sm" [class.text-green-500]="aovGrowth >= 0" [class.text-red-500]="aovGrowth < 0">
                  <i class="pi" [class.pi-arrow-up]="aovGrowth >= 0" [class.pi-arrow-down]="aovGrowth < 0"></i>
                  {{ Math.abs(aovGrowth) }}% so với tuần trước
                </div>
              </div>
              <div class="bg-orange-500 border-round flex align-items-center justify-content-center" style="width: 3rem; height: 3rem">
                <i class="pi pi-chart-line text-white text-xl"></i>
              </div>
            </div>
          </p-card>
        </div>
      </div>

      <div class="grid">
        <!-- Sales Chart -->
        <div class="col-12 lg:col-8">
          <p-card header="Biểu đồ doanh thu">
            <p-chart 
              type="line" 
              [data]="salesChartData" 
              [options]="salesChartOptions"
              height="300px">
            </p-chart>
          </p-card>
        </div>

        <!-- Top Products -->
        <div class="col-12 lg:col-4">
          <p-card header="Sản phẩm bán chạy">
            <p-table [value]="topProducts" [paginator]="false">
              <ng-template pTemplate="header">
                <tr>
                  <th>Sản phẩm</th>
                  <th>SL</th>
                  <th>Doanh thu</th>
                </tr>
              </ng-template>
              <ng-template pTemplate="body" let-product let-i="rowIndex">
                <tr>
                  <td>
                    <div class="flex align-items-center">
                      <p-tag 
                        [value]="(i + 1).toString()" 
                        [severity]="i === 0 ? 'success' : i === 1 ? 'info' : i === 2 ? 'warning' : 'secondary'"
                        class="mr-2">
                      </p-tag>
                      <div>
                        <div class="font-medium">{{ product.name }}</div>
                        <div class="text-sm text-500">{{ product.category }}</div>
                      </div>
                    </div>
                  </td>
                  <td>{{ product.quantity }}</td>
                  <td>{{ product.revenue | currency : 'VND' : 'symbol' : '1.0-0' }}</td>
                </tr>
              </ng-template>
            </p-table>
          </p-card>
        </div>
      </div>

      <!-- Recent Orders -->
      <div class="grid mt-4">
        <div class="col-12">
          <p-card header="Đơn hàng gần đây">
            <p-table [value]="recentOrders" [paginator]="true" [rows]="10">
              <ng-template pTemplate="header">
                <tr>
                  <th>ID Đơn hàng</th>
                  <th>Khách hàng</th>
                  <th>Sản phẩm</th>
                  <th>Tổng tiền</th>
                  <th>Thanh toán</th>
                  <th>Trạng thái</th>
                  <th>Thời gian</th>
                </tr>
              </ng-template>
              <ng-template pTemplate="body" let-order>
                <tr>
                  <td>{{ order.id }}</td>
                  <td>{{ order.customerName || 'Khách lẻ' }}</td>
                  <td>{{ order.itemCount }} sản phẩm</td>
                  <td>{{ order.total | currency : 'VND' : 'symbol' : '1.0-0' }}</td>
                  <td>{{ getPaymentMethodLabel(order.paymentMethod) }}</td>
                  <td>
                    <p-tag 
                      [value]="getStatusLabel(order.status)" 
                      [severity]="getStatusSeverity(order.status)">
                    </p-tag>
                  </td>
                  <td>{{ order.createdAt | date : 'dd/MM/yyyy HH:mm' }}</td>
                </tr>
              </ng-template>
            </p-table>
          </p-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .sales-dashboard {
      background-color: #f8f9fa;
      min-height: 100vh;
    }

    ::ng-deep .p-card .p-card-content {
      padding: 1rem;
    }

    ::ng-deep .p-tag {
      font-size: 0.75rem;
    }
  `]
})
export class SalesDashboardComponent implements OnInit {
  // Date and period selection
  selectedDate: Date = new Date();
  selectedPeriod = 'today';
  periodOptions = [
    { label: 'Hôm nay', value: 'today' },
    { label: 'Tuần này', value: 'week' },
    { label: 'Tháng này', value: 'month' },
    { label: '3 tháng', value: 'quarter' },
  ];

  // Summary metrics
  todayRevenue = 15750000;
  revenueGrowth = 12.5;
  todayOrders = 24;
  ordersGrowth = 8.3;
  newCustomers = 7;
  averageOrderValue = 656250;
  aovGrowth = -2.1;

  // Math for template
  Math = Math;

  // Chart data
  salesChartData: any;
  salesChartOptions: any;

  // Table data
  topProducts: TopProduct[] = [
    { name: 'Áo sơ mi nam', quantity: 12, revenue: 3600000, category: 'Áo' },
    { name: 'Quần jeans nữ', quantity: 8, revenue: 2400000, category: 'Quần' },
    { name: 'Giày sneaker', quantity: 6, revenue: 1800000, category: 'Giày' },
    { name: 'Túi xách da', quantity: 4, revenue: 1200000, category: 'Phụ kiện' },
    { name: 'Áo khoác hoodie', quantity: 5, revenue: 1500000, category: 'Áo' },
  ];

  recentOrders = [
    {
      id: 'ORD-001',
      customerName: 'Nguyễn Văn A',
      itemCount: 3,
      total: 850000,
      paymentMethod: 'cash',
      status: 'completed',
      createdAt: new Date()
    },
    {
      id: 'ORD-002',
      customerName: 'Trần Thị B',
      itemCount: 1,
      total: 450000,
      paymentMethod: 'card',
      status: 'completed',
      createdAt: new Date(Date.now() - 1000 * 60 * 30)
    },
    {
      id: 'ORD-003',
      customerName: null,
      itemCount: 2,
      total: 650000,
      paymentMethod: 'digital',
      status: 'completed',
      createdAt: new Date(Date.now() - 1000 * 60 * 45)
    },
  ];

  ngOnInit() {
    this.initializeChartData();
  }

  initializeChartData() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.salesChartData = {
      labels: ['6h', '9h', '12h', '15h', '18h', '21h'],
      datasets: [
        {
          label: 'Doanh thu (VND)',
          data: [1200000, 1900000, 3000000, 2500000, 2200000, 3400000],
          fill: false,
          borderColor: documentStyle.getPropertyValue('--blue-500'),
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4
        },
        {
          label: 'Số đơn hàng',
          data: [8, 12, 18, 15, 13, 20],
          fill: false,
          borderColor: documentStyle.getPropertyValue('--green-500'),
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          tension: 0.4,
          yAxisID: 'y1'
        }
      ]
    };

    this.salesChartOptions = {
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        },
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          ticks: {
            color: textColorSecondary,
            callback: function(value: any) {
              return (value / 1000000).toFixed(1) + 'M';
            }
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          ticks: {
            color: textColorSecondary
          },
          grid: {
            drawOnChartArea: false,
          },
        }
      }
    };
  }

  onPeriodChange() {
    // Update data based on selected period
    console.log('Period changed to:', this.selectedPeriod);
  }

  exportReport() {
    // Export functionality
    console.log('Exporting report...');
  }

  getPaymentMethodLabel(method: string): string {
    const labels = {
      'cash': 'Tiền mặt',
      'card': 'Thẻ',
      'digital': 'Ví điện tử'
    };
    return labels[method as keyof typeof labels] || method;
  }

  getStatusLabel(status: string): string {
    const labels = {
      'completed': 'Hoàn thành',
      'pending': 'Đang xử lý',
      'cancelled': 'Đã hủy'
    };
    return labels[status as keyof typeof labels] || status;
  }

  getStatusSeverity(status: string): 'success' | 'warning' | 'danger' | 'info' {
    const severities = {
      'completed': 'success' as const,
      'pending': 'warning' as const,
      'cancelled': 'danger' as const
    };
    return severities[status as keyof typeof severities] || 'info';
  }
}
