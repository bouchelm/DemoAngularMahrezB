import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { IProxyPiste } from './i-proxy-piste';
import { Piste, PisteCreationRequest } from '../../types/piste';

@Injectable({
  providedIn: 'root'
})
export class ProxyPisteReel extends IProxyPiste {
  private readonly baseUrl = '/api/pistes';

  constructor(private http: HttpClient) {
    super();
  }

  obtenirPiste(identifiant: string): Observable<Piste> {
    return this.http.get<Piste>(`${this.baseUrl}/${identifiant}`).pipe(
      catchError(this.gererErreur)
    );
  }

  obtenirToutesPistes(): Observable<Piste[]> {
    return this.http.get<Piste[]>(this.baseUrl).pipe(
      catchError(this.gererErreur)
    );
  }

  creerPiste(requete: PisteCreationRequest): Observable<Piste> {
    return this.http.post<Piste>(`${this.baseUrl}/create`, requete).pipe(
      catchError(this.gererErreur)
    );
  }

  modifierPiste(identifiant: string, requete: PisteCreationRequest): Observable<Piste> {
    return this.http.put<Piste>(`${this.baseUrl}/${identifiant}`, requete).pipe(
      catchError(this.gererErreur)
    );
  }

  supprimerPiste(identifiant: string): Observable<void> {
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
          messageErreur = 'Piste non trouvée';
          break;
        case 409:
          messageErreur = 'Conflit: cette piste existe déjà';
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
