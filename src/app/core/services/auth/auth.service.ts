import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ILoginData } from '@app/infrastructure/interfaces';
import { IResponse } from '@app/infrastructure/interfaces/response.interface';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router, private http: HttpClient) { }

  protected getApiUrl(url): string {
    return `${environment.serverUrl + url}`;
  }

  public isAuthenticated(): boolean {
    try {
      const jwtHelper = new JwtHelperService();
      const token = this.accessToken;
      return !jwtHelper.isTokenExpired(token);
    } catch (err) {
      return false;
    }
  }

  public login(loginData: ILoginData): Observable<any> {
    return this.http.post<IResponse<{access_token: string}>>(this.getApiUrl('customer/getCustomerWithEmailAndPass'), loginData).pipe(
      map(res => {
        localStorage.setItem('access_token', res.data.access_token);
        return res;
      })
    );
  }

  public logout(): void {
    this.router.navigate(['login']);
    localStorage.removeItem('access_token');
  }

  public get accessToken(): string {
    return localStorage.getItem('access_token');
  }
}

