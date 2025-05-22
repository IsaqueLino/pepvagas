import { Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userType: string = '';
  private userName: string = '';
  private userId: string = '';
  private userTypeSubject = new BehaviorSubject<string>('');
  userType$ = this.userTypeSubject.asObservable();
  private userNameSubject = new BehaviorSubject<string>('');
  userName$ = this.userTypeSubject.asObservable();
  private userIdSubject = new BehaviorSubject<string>('');
  userId$ = this.userIdSubject.asObservable();

  constructor(
    private navCtrl: NavController
  ) {}

  setUserGoogle(user: any, token: string, credential: any) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', user);
  }

  setUserType(userType: string) {
    this.userType = userType;
    this.userTypeSubject.next(userType); // Notifique os observadores sobre a alteração do tipo de usuário
  }

  setUserName(userName: string) {
    this.userName = userName;
    this.userNameSubject.next(userName);
  }

  setUserId(userId: string) {
    this.userId = userId;
    this.userIdSubject.next(userId);
  }

  getUserId(): string | null {
    return this.userId;
  }
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUserType(): string {
    return localStorage.getItem('userType') || '';
  }

  getUserName(): string {
    return localStorage.getItem('userName') || '';
  }

  isAuthenticatedUser(): boolean {

    return this.getToken() !== null;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userType');
    this.setUserId('');
    this.setUserType('');
    this.setUserName('');
    this.navCtrl.navigateRoot('/login');
  }
}
