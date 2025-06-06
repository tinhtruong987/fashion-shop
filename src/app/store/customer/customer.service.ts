import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Customer, CustomerFilter } from './model/customer.model';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private customers: Customer[] = [
    {
      id: '1',
      name: 'Nguyễn Văn An',
      phone: '0901234567',
      email: 'an.nguyen@email.com',
      address: '123 Lê Lợi, Q.1, TP.HCM',
      loyaltyPoints: 1250,
      totalPurchases: 15000000,
      membershipLevel: 'Gold',
      createdAt: new Date('2023-01-15'),
      updatedAt: new Date('2024-12-01'),
    },
    {
      id: '2',
      name: 'Trần Thị Bình',
      phone: '0907654321',
      email: 'binh.tran@email.com',
      address: '456 Nguyễn Huệ, Q.1, TP.HCM',
      loyaltyPoints: 850,
      totalPurchases: 8500000,
      membershipLevel: 'Silver',
      createdAt: new Date('2023-03-20'),
      updatedAt: new Date('2024-11-28'),
    },
    {
      id: '3',
      name: 'Lê Minh Cường',
      phone: '0912345678',
      email: 'cuong.le@email.com',
      address: '789 Pasteur, Q.3, TP.HCM',
      loyaltyPoints: 2100,
      totalPurchases: 25000000,
      membershipLevel: 'Platinum',
      createdAt: new Date('2022-11-10'),
      updatedAt: new Date('2024-12-05'),
    },
    {
      id: '4',
      name: 'Phạm Thị Dung',
      phone: '0934567890',
      loyaltyPoints: 350,
      totalPurchases: 3200000,
      membershipLevel: 'Bronze',
      createdAt: new Date('2024-08-15'),
      updatedAt: new Date('2024-11-20'),
    },
  ];

  getCustomers(): Observable<Customer[]> {
    return of(this.customers).pipe(delay(500));
  }

  searchCustomers(searchTerm: string): Observable<Customer[]> {
    const filtered = this.customers.filter(
      (customer) =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone.includes(searchTerm) ||
        (customer.email &&
          customer.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    return of(filtered).pipe(delay(300));
  }

  filterCustomers(filter: CustomerFilter): Observable<Customer[]> {
    let filtered = this.customers;

    if (filter.searchTerm) {
      filtered = filtered.filter(
        (customer) =>
          customer.name
            .toLowerCase()
            .includes(filter.searchTerm!.toLowerCase()) ||
          customer.phone.includes(filter.searchTerm!) ||
          (customer.email &&
            customer.email
              .toLowerCase()
              .includes(filter.searchTerm!.toLowerCase()))
      );
    }

    if (filter.membershipLevel) {
      filtered = filtered.filter(
        (customer) => customer.membershipLevel === filter.membershipLevel
      );
    }

    if (filter.minLoyaltyPoints !== undefined) {
      filtered = filtered.filter(
        (customer) => customer.loyaltyPoints >= filter.minLoyaltyPoints!
      );
    }

    return of(filtered).pipe(delay(300));
  }

  addCustomer(customer: Customer): Observable<Customer> {
    const newCustomer = {
      ...customer,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.customers.push(newCustomer);
    return of(newCustomer).pipe(delay(500));
  }

  updateCustomer(customer: Customer): Observable<Customer> {
    const index = this.customers.findIndex((c) => c.id === customer.id);
    if (index !== -1) {
      this.customers[index] = { ...customer, updatedAt: new Date() };
      return of(this.customers[index]).pipe(delay(500));
    }
    throw new Error('Customer not found');
  }

  updateLoyaltyPoints(
    customerId: string,
    pointsChange: number
  ): Observable<Customer> {
    const customer = this.customers.find((c) => c.id === customerId);
    if (customer) {
      customer.loyaltyPoints += pointsChange;
      customer.updatedAt = new Date();

      // Update membership level based on total purchases
      if (customer.totalPurchases >= 20000000) {
        customer.membershipLevel = 'Platinum';
      } else if (customer.totalPurchases >= 10000000) {
        customer.membershipLevel = 'Gold';
      } else if (customer.totalPurchases >= 5000000) {
        customer.membershipLevel = 'Silver';
      } else {
        customer.membershipLevel = 'Bronze';
      }

      return of(customer).pipe(delay(300));
    }
    throw new Error('Customer not found');
  }

  getLoyaltyDiscount(membershipLevel: string, pointsUsed: number): number {
    const discountRates = {
      Bronze: 0.01, // 1% per 100 points
      Silver: 0.015, // 1.5% per 100 points
      Gold: 0.02, // 2% per 100 points
      Platinum: 0.025, // 2.5% per 100 points
    };

    const rate =
      discountRates[membershipLevel as keyof typeof discountRates] || 0.01;
    return Math.floor(pointsUsed / 100) * rate * 100; // Convert to percentage
  }
}
