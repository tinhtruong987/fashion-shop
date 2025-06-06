import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Sale, PaymentMethod } from './model/pos.model';

@Injectable({
  providedIn: 'root',
})
export class POSService {
  private sales: Sale[] = [];

  processPayment(sale: Sale): Observable<Sale> {
    const newSale = {
      ...sale,
      id: `SALE-${Date.now()}`,
      saleDate: new Date(),
      status: 'completed' as const,
    };

    this.sales.push(newSale);
    return of(newSale).pipe(delay(1000));
  }

  getSales(): Observable<Sale[]> {
    return of(this.sales).pipe(delay(500));
  }

  calculateLoyaltyPointsEarned(total: number): number {
    // Earn 1 point for every 10,000 VND spent
    return Math.floor(total / 10000);
  }

  generateReceiptNumber(): string {
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2);
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const time = now.getTime().toString().slice(-6);
    return `${year}${month}${day}-${time}`;
  }
}
