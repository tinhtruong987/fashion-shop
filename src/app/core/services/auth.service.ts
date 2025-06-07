import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { UserAccount, UserRole } from '../../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<UserAccount | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  login(username: string, password: string): Observable<UserAccount> {
    // Mock login - in real app, this would call an API
    const mockUser: UserAccount = {
      userAccountID: 1,
      username: username,
      passwordHash: '', // In real app, never store password
      email: 'admin@example.com',
      role: UserRole.Admin,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    localStorage.setItem('currentUser', JSON.stringify(mockUser));
    this.currentUserSubject.next(mockUser);
    return of(mockUser);
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!this.currentUserSubject.value;
  }

  hasRole(role: UserRole): boolean {
    return this.currentUserSubject.value?.role === role;
  }

  forgotPassword(email: string): Observable<boolean> {
    // Mock implementation - in real app, this would call an API
    return of(true);
  }
}
