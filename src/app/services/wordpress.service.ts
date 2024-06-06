import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WordpressService {
  private apiUrl = 'https://laiterieburdigala.fr/wp-json/laiterie-burdigala/v1';

  constructor(private http: HttpClient) { }

  getHomepage(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/homepage`);
  }

  getProducts(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/nos-produits`);
  }

  getOrder(): Observable<any> {
    return this.http.get(`${this.apiUrl}/finaliser-commande`);
  }

  sendOrderDetails(orderDetails: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/send-order`, orderDetails);
  }

  getWorkshop(): Observable<any> {
    return this.http.get(`${this.apiUrl}/nos-ateliers`);
  }

  getBrunchs(): Observable<any> {
    return this.http.get(`${this.apiUrl}/notre-brunch`);
  }

  getSuppliers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/nos-fournisseurs`);
  }

  getAboutUs(): Observable<any> {
    return this.http.get(`${this.apiUrl}/a-propos-de-nous`);
  }

  getLegalNotices(): Observable<any> {
    return this.http.get(`${this.apiUrl}/mentions-legales`);
  }

  getPrivacyPolicy(): Observable<any> {
    return this.http.get(`${this.apiUrl}/confidentialite`);
  }

  getTermsConditions(): Observable<any> {
    return this.http.get(`${this.apiUrl}/cgv`);
  }

  getPageContent(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/pages/62`); 
  }
}
