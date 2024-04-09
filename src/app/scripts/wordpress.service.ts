import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WordpressService {
  private apiUrl = 'https://laiterieburdigala.fr/wp-json/laiterie-burdigala/v1';

  constructor(private http: HttpClient) { }

  getHomepageContent(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/homepage`);
  }

  //getProducts(): Observable<any> {
  //  return this.http.get(`${this.apiUrl}/nos-produits`);
  //}

  //getFinalizeOrders(): Observable<any> {
  //  return this.http.get(`${this.apiUrl}/finaliser-commande`);
  //}

  //getWorkshop(): Observable<any> {
  //  return this.http.get(`${this.apiUrl}/nos-ateliers`);
  //}

  //getBrunchs(): Observable<any> {
  //  return this.http.get(`${this.apiUrl}/nos-brunchs`);
  //}

  //getSuppliers(): Observable<any> {
  //  return this.http.get(`${this.apiUrl}/nos-fournisseurs`);
  //}

  //getAboutUS(): Observable<any> {
  //  return this.http.get(`${this.apiUrl}/a-propos-de-nous`);
  //}
}
