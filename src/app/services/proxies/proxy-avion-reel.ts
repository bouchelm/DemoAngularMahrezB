import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { IProxyAvion } from './i-proxy-avion';
import { Avion, AvionCreationRequest } from '../../types/avion';

@Injectable({
  providedIn: 'root'
})
export class ProxyAvionReel extends IProxyAvion {
  private readonly baseUrl = '/api/avions';

  constructor(private http: HttpClient) {
    super();
  }

  obtenirAvion(immatriculation: string): Observable<Avion> {
    return this.http.get<Avion>(`${this.baseUrl}/${immatriculation}`).pipe(
      catchError(this.gererErreur)
    );
  }

  obtenirTousLesAvions(): Observable<Avion[]> {
    return this.http.get<Avion[]>(this.baseUrl).pipe(
      catchError(this.gererErreur)
    );
  }

  creerAvion(requete: AvionCreationRequest): Observable<Avion> {
    return this.http.post<Avion>(`${this.baseUrl}/create`, requete).pipe(
      catchError(this.gererErreur)
    );
  }

  modifierAvion(immatriculation: string, requete: AvionCreationRequest): Observable<Avion> {
    return this.http.put<Avion>(`${this.baseUrl}/${immatriculation}`, requete).pipe(
      catchError(this.gererErreur)
    );
  }

  supprimerAvion(immatriculation: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${immatriculation}`).pipe(
      catchError(this.gererErreur)
    );
  }

  assignerVol(immatriculation: string, numeroVol: number): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${immatriculation}/vols/${numeroVol}`, {}).pipe(
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
          messageErreur = 'Avion non trouvé';
          break;
        case 409:
          messageErreur = 'Conflit: cet avion existe déjà';
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