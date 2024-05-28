import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private apiUrl = 'https://laiterieburdigala.fr/wp-json/laiterie-burdigala/v1';

  constructor(private http: HttpClient) { }

  sendOrder(orderDetails: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/send-order`, orderDetails);
  }
}
