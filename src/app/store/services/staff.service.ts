import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import {
  UserAccount,
  Staff,
  LoginRequest,
  LoginResponse,
  CreateStaffRequest,
  UpdateStaffRequest,
} from '../models/staff.model';

@Injectable({
  providedIn: 'root',
})
export class StaffService {
  private mockUsers: UserAccount[] = [
    {
      UserAccountID: 1,
      Username: 'admin',
      Email: 'admin@fashionshop.vn',
      PasswordHash: 'hashed_password_123',
      Role: 'Admin',
      IsActive: true,
      CreatedAt: new Date('2024-01-01'),
      UpdatedAt: new Date('2024-01-01'),
    },
    {
      UserAccountID: 2,
      Username: 'staff01',
      Email: 'staff01@fashionshop.vn',
      PasswordHash: 'hashed_password_456',
      Role: 'Staff',
      IsActive: true,
      CreatedAt: new Date('2024-01-15'),
      UpdatedAt: new Date('2024-01-15'),
    },
  ];

  private mockStaff: Staff[] = [
    {
      StaffID: 1,
      UserAccountID: 1,
      Name: 'Nguyễn Văn Admin',
      Position: 'Quản lý',
      IsActive: true,
      CreatedAt: new Date('2024-01-01'),
      UpdatedAt: new Date('2024-01-01'),
    },
    {
      StaffID: 2,
      UserAccountID: 2,
      Name: 'Trần Thị Nhân Viên',
      Position: 'Nhân viên bán hàng',
      IsActive: true,
      CreatedAt: new Date('2024-01-15'),
      UpdatedAt: new Date('2024-01-15'),
    },
  ];

  private currentUser: UserAccount | null = null;
  login(request: LoginRequest): Observable<LoginResponse> {
    const user = this.mockUsers.find(
      (u) =>
        (u.Username === request.Username || u.Email === request.Username) &&
        u.IsActive
    );

    if (user && request.Password === 'password') {
      this.currentUser = user;
      const staff = this.mockStaff.find(
        (s) => s.UserAccountID === user.UserAccountID
      );

      if (staff) {
        const response: LoginResponse = {
          token: 'mock_jwt_token_' + user.UserAccountID,
          staff: {
            ...staff,
            UserAccount: user,
          },
        };

        return of(response).pipe(delay(800));
      }
    }

    // Return error - could not authenticate
    throw new Error('Tên đăng nhập hoặc mật khẩu không đúng');
  }
  logout(): Observable<boolean> {
    this.currentUser = null;
    return of(true).pipe(delay(300));
  }

  getCurrentUser(): UserAccount | null {
    return this.currentUser;
  }

  isLoggedIn(): boolean {
    return this.currentUser !== null;
  }

  resetPassword(email: string): Observable<boolean> {
    const user = this.mockUsers.find((u) => u.Email === email);
    return of(!!user).pipe(delay(1000));
  }

  getStaff(): Observable<Staff[]> {
    return of(this.mockStaff.filter((s) => s.IsActive)).pipe(delay(300));
  }

  getStaffById(id: number): Observable<Staff | undefined> {
    const staff = this.mockStaff.find((s) => s.StaffID === id);
    return of(staff).pipe(delay(200));
  }

  createStaff(request: CreateStaffRequest): Observable<Staff> {
    const newUserId =
      Math.max(...this.mockUsers.map((u) => u.UserAccountID)) + 1;
    const newUser: UserAccount = {
      UserAccountID: newUserId,
      Username: request.Username,
      Email: request.Email,
      PasswordHash: 'hashed_' + request.Password,
      Role: request.Role,
      IsActive: true,
      CreatedAt: new Date(),
      UpdatedAt: new Date(),
    };
    this.mockUsers.push(newUser);

    const newStaffId = Math.max(...this.mockStaff.map((s) => s.StaffID)) + 1;
    const newStaff: Staff = {
      StaffID: newStaffId,
      UserAccountID: newUserId,
      Name: request.Name,
      Position: request.Position,
      IsActive: true,
      CreatedAt: new Date(),
      UpdatedAt: new Date(),
    };

    this.mockStaff.push(newStaff);
    return of(newStaff).pipe(delay(500));
  }

  updateStaff(request: UpdateStaffRequest): Observable<Staff> {
    const staffIndex = this.mockStaff.findIndex(
      (s) => s.StaffID === request.StaffID
    );

    if (staffIndex !== -1) {
      this.mockStaff[staffIndex] = {
        ...this.mockStaff[staffIndex],
        Name: request.Name,
        Position: request.Position,
        IsActive: request.IsActive,
        UpdatedAt: new Date(),
      };
    }

    return of(this.mockStaff[staffIndex]).pipe(delay(400));
  }

  deleteStaff(id: number): Observable<boolean> {
    const staffIndex = this.mockStaff.findIndex((s) => s.StaffID === id);
    if (staffIndex !== -1) {
      const userIndex = this.mockUsers.findIndex(
        (u) => u.UserAccountID === this.mockStaff[staffIndex].UserAccountID
      );

      this.mockStaff[staffIndex].IsActive = false;
      this.mockStaff[staffIndex].UpdatedAt = new Date();

      if (userIndex !== -1) {
        this.mockUsers[userIndex].IsActive = false;
        this.mockUsers[userIndex].UpdatedAt = new Date();
      }
    }
    return of(true).pipe(delay(400));
  }
}
