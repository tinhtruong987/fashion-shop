import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { Receipt } from '../../../store/pos/model/pos.model';

@Component({
  selector: 'app-receipt',
  standalone: true,
  imports: [CommonModule, ButtonModule, DialogModule, DividerModule],
  template: `
    <p-dialog
      header="Hóa đơn bán hàng"
      [(visible)]="visible"
      (visibleChange)="visibleChange.emit($event)"
      [modal]="true"
      [style]="{ width: '400px' }"
      [draggable]="false"
      [resizable]="false"
    >
      <div class="receipt-content" #receiptContent>
        <!-- Store Header -->
        <div class="text-center mb-4">
          <h3 class="font-bold mb-1">
            {{ receipt?.storeInfo?.name || 'FASHION SHOP' }}
          </h3>
          <p class="text-sm text-500 mb-1">
            {{ receipt?.storeInfo?.address || 'Địa chỉ cửa hàng' }}
          </p>
          <p class="text-sm text-500 mb-1">
            Tel: {{ receipt?.storeInfo?.phone || '0123-456-789' }}
          </p>
          <p class="text-sm text-500">
            MST: {{ receipt?.storeInfo?.taxId || '0123456789' }}
          </p>
        </div>

        <p-divider></p-divider>

        <!-- Receipt Info -->
        <div class="mb-3">
          <div class="flex justify-content-between text-sm mb-1">
            <span>Số hóa đơn:</span>
            <span class="font-medium">{{ receipt?.receiptNumber }}</span>
          </div>
          <div class="flex justify-content-between text-sm mb-1">
            <span>Ngày:</span>
            <span>{{ receipt?.saleDate | date : 'dd/MM/yyyy HH:mm' }}</span>
          </div>
          <div class="flex justify-content-between text-sm mb-1">
            <span>Thu ngân:</span>
            <span>{{ receipt?.cashierName }}</span>
          </div>
          <div
            class="flex justify-content-between text-sm"
            *ngIf="receipt?.customerInfo"
          >
            <span>Khách hàng:</span>
            <span>{{ receipt?.customerInfo?.name }}</span>
          </div>
        </div>

        <p-divider></p-divider>

        <!-- Items -->
        <div class="mb-3">
          <div
            *ngFor="let item of receipt?.items"
            class="flex justify-content-between text-sm mb-2"
          >
            <div class="flex-1">
              <div class="font-medium">{{ item.productName }}</div>
              <div class="text-500">
                {{ item.quantity }} x
                {{ item.price | currency : 'VND' : 'symbol' : '1.0-0' }}
              </div>
            </div>
            <div class="font-medium">
              {{ item.totalPrice | currency : 'VND' : 'symbol' : '1.0-0' }}
            </div>
          </div>
        </div>

        <p-divider></p-divider>

        <!-- Totals -->
        <div class="mb-3">
          <div class="flex justify-content-between text-sm mb-1">
            <span>Tạm tính:</span>
            <span>{{
              receipt?.subtotal | currency : 'VND' : 'symbol' : '1.0-0'
            }}</span>
          </div>

          <div
            class="flex justify-content-between text-sm mb-1"
            *ngIf="receipt && receipt.discount > 0"
          >
            <span>Giảm giá:</span>
            <span
              >-{{
                receipt.discount | currency : 'VND' : 'symbol' : '1.0-0'
              }}</span
            >
          </div>

          <div
            class="flex justify-content-between text-sm mb-1"
            *ngIf="receipt && receipt.loyaltyPointsUsed > 0"
          >
            <span>Điểm tích lũy (-{{ receipt.loyaltyPointsUsed }} điểm):</span>
            <span
              >-{{
                receipt.loyaltyPointsUsed * 1000
                  | currency : 'VND' : 'symbol' : '1.0-0'
              }}</span
            >
          </div>

          <p-divider></p-divider>

          <div class="flex justify-content-between font-bold">
            <span>TỔNG CỘNG:</span>
            <span>{{
              receipt?.total | currency : 'VND' : 'symbol' : '1.0-0'
            }}</span>
          </div>
        </div>

        <!-- Payment Info -->
        <div class="mb-3">
          <p-divider></p-divider>
          <div
            *ngFor="let payment of receipt?.paymentMethods"
            class="flex justify-content-between text-sm mb-1"
          >
            <span>{{ getPaymentMethodLabel(payment.type) }}:</span>
            <span>{{
              payment.amount | currency : 'VND' : 'symbol' : '1.0-0'
            }}</span>
          </div>
        </div>
        <!-- Loyalty Points Info -->
        <div
          class="mb-3 text-center"
          *ngIf="
            receipt?.customerInfo &&
            receipt?.loyaltyPointsEarned &&
            (receipt?.loyaltyPointsEarned || 0) > 0
          "
        >
          <p-divider></p-divider>
          <div class="bg-blue-50 p-2 border-round">
            <p class="text-sm font-medium mb-1">Điểm tích lũy được:</p>
            <p class="text-lg font-bold text-primary">
              +{{ receipt?.loyaltyPointsEarned }} điểm
            </p>
            <p class="text-xs text-500">
              Tổng điểm:
              {{
                (receipt?.customerInfo?.loyaltyPoints || 0) +
                  (receipt?.loyaltyPointsEarned || 0)
              }}
              điểm
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div class="text-center text-sm text-500">
          <p class="mb-1">Cảm ơn quý khách đã mua hàng!</p>
          <p class="mb-1">Hẹn gặp lại quý khách</p>
          <p>* Vui lòng giữ hóa đơn để được bảo hành *</p>
        </div>
      </div>

      <ng-template pTemplate="footer">
        <div class="flex gap-2">
          <p-button
            label="In hóa đơn"
            icon="pi pi-print"
            severity="secondary"
            [outlined]="true"
            (onClick)="printReceipt()"
          >
          </p-button>
          <p-button label="Đóng" icon="pi pi-times" (onClick)="visible = false">
          </p-button>
        </div>
      </ng-template>
    </p-dialog>
  `,
  styles: [
    `
      .receipt-content {
        font-family: 'Courier New', monospace;
        max-width: 350px;
        margin: 0 auto;
      }

      ::ng-deep .receipt-content .p-divider {
        margin: 0.5rem 0;
      }

      ::ng-deep .receipt-content .p-divider .p-divider-content {
        padding: 0;
      }

      @media print {
        .receipt-content {
          -webkit-print-color-adjust: exact;
          color-adjust: exact;
        }

        body * {
          visibility: hidden;
        }

        .receipt-content,
        .receipt-content * {
          visibility: visible;
        }

        .receipt-content {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          margin: 0;
          padding: 20px;
        }
      }
    `,
  ],
})
export class ReceiptComponent {
  @Input() visible = false;
  @Input() receipt: Receipt | null = null;
  @Output() visibleChange = new EventEmitter<boolean>();

  getPaymentMethodLabel(type: string): string {
    const labels = {
      cash: 'Tiền mặt',
      card: 'Thẻ',
      digital: 'Ví điện tử',
    };
    return labels[type as keyof typeof labels] || type;
  }

  printReceipt() {
    window.print();
  }
}
