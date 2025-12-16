import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { IProxyHangar } from './i-proxy-hangar';
import { Hangar, HangarCreationRequest } from '../../types/hangar';

@Injectable({
  providedIn: 'root'
})
export class ProxyHangarReel extends IProxyHangar {
  private readonly baseUrl = '/api/hangars';

  constructor(private http: HttpClient) {
    super();
  }

  obtenirHangar(identifiant: string): Observable<Hangar> {
    return this.http.get<Hangar>(`${this.baseUrl}/${identifiant}`).pipe(
      catchError(this.gererErreur)
    );
  }

  obtenirTousLesHangars(): Observable<Hangar[]> {
    return this.http.get<Hangar[]>(this.baseUrl).pipe(
      catchError(this.gererErreur)
    );
  }

  creerHangar(requete: HangarCreationRequest): Observable<Hangar> {
    return this.http.post<Hangar>(`${this.baseUrl}/create`, requete).pipe(
      catchError(this.gererErreur)
    );
  }

  modifierHangar(identifiant: string, requete: HangarCreationRequest): Observable<Hangar> {
    return this.http.put<Hangar>(`${this.baseUrl}/${identifiant}`, requete).pipe(
      catchError(this.gererErreur)
    );
  }

  supprimerHangar(identifiant: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${identifiant}`).pipe(
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
          messageErreur = 'Hangar non trouvé';
          break;
        case 409:
          messageErreur = 'Conflit: ce hangar existe déjà';
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
