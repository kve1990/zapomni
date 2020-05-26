import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpClient
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  private readonly settingsUrl = 'api/widget/v1/settings';
  private readonly settingsToken = 'x-auth-token';
  private token: string;

  constructor(private http: HttpClient) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (request && request.url === this.settingsUrl) {
      return next.handle(request);
    }

    this.token = localStorage.getItem(this.settingsToken);

    if (!this.token) {
      this.setToken();
    }

    const headers = request.headers.append('Authorization', `Bearer ${this.token}`);
    const requestWithAuth = request.clone({ headers });
    return next.handle(requestWithAuth);
  }

  async setToken(): Promise<string> {
    const response = await this.http.get(this.settingsUrl, {observe: 'response'}).toPromise();
    this.token = response.headers.get(this.settingsToken);
    localStorage.setItem(this.settingsToken, this.token);
    return this.token;
  }
}
