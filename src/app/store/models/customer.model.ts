export interface Customer {
  CustomerID: number;
  FullName: string;
  PhoneNumber: string;
  Email?: string;
  Gender?: string;
  DateOfBirth?: Date;
  Address?: string;
  Point: number;
  IsActive: boolean;
  CreatedAt: Date;
  UpdatedAt?: Date;
}

export interface CreateCustomerRequest {
  FullName: string;
  PhoneNumber: string;
  Email?: string;
  Gender?: string;
  DateOfBirth?: Date;
  Address?: string;
}

export interface UpdateCustomerRequest {
  FullName?: string;
  PhoneNumber?: string;
  Email?: string;
  Gender?: string;
  DateOfBirth?: Date;
  Address?: string;
}
