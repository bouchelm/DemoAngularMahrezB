import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { IProxyVol } from './i-proxy-vol';
import { Vol, VolCreationRequest } from '../../types/vol';

@Injectable({
  providedIn: 'root'
})
export class ProxyVolReel extends IProxyVol {
  private readonly baseUrl = '/api/vol';

  constructor(private http: HttpClient) {
    super();
  }

  obtenirVol(numero: number): Observable<Vol> {
    return this.http.get<Vol>(`${this.baseUrl}/${numero}`).pipe(
      catchError(this.gererErreur)
    );
  }

  obtenirDeparts(): Observable<Vol[]> {
    return this.http.get<Vol[]>(`${this.baseUrl}/departs`).pipe(
      catchError(this.gererErreur)
    );
  }

  obtenirArrivees(): Observable<Vol[]> {
    return this.http.get<Vol[]>(`${this.baseUrl}/arrivees`).pipe(
      catchError(this.gererErreur)
    );
  }

  creerVol(requete: VolCreationRequest): Observable<Vol> {
    return this.http.post<Vol>(`${this.baseUrl}/create`, requete).pipe(
      catchError(this.gererErreur)
    );
  }

  modifierVol(numero: number, requete: VolCreationRequest): Observable<Vol> {
    return this.http.put<Vol>(`${this.baseUrl}/${numero}`, requete).pipe(
      catchError(this.gererErreur)
    );
  }

  supprimerVol(numero: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${numero}`).pipe(
      catchError(this.gererErreur)
    );
  }

  private gererErreur(erreur: HttpErrorResponse): Observable<never> {
    let messageErreur = 'Une erreur est survenue';

    if (erreur.error instanceof ErrorEvent) {
      messageErreur = `Erreur client: ${erreur.error.message}`;
    } else {
      switch (erreur.status) {
        case 400:
          messageErreur = 'Requête invalide';
          break;
        case 404:
          messageErreur = 'Vol non trouvé';
          break;
        case 409:
          messageErreur = 'Conflit: ce vol existe déjà';
          break;
        case 500:
          messageErreur = 'Erreur serveur';
          break;
        default:
          messageErreur = `Erreur ${erreur.status}: ${erreur.message}`;
      }
    }

    return throwError(() => new Error(messageErreur));
  }
}