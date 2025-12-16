import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { IProxyPlanification, Assignation, AssignationRequest } from './i-proxy-planification';

@Injectable({
  providedIn: 'root'
})
export class ProxyPlanificationReel extends IProxyPlanification {
  private readonly baseUrl = '/api/planification-pistes';

  constructor(private http: HttpClient) {
    super();
  }

  affecter(requete: AssignationRequest): Observable<Assignation> {
    return this.http.post<Assignation>(`${this.baseUrl}/affecter`, requete).pipe(
      catchError(this.gererErreur)
    );
  }

  obtenirAssignationsPiste(pisteId: string): Observable<Assignation[]> {
    return this.http.get<Assignation[]>(`${this.baseUrl}/piste/${pisteId}`).pipe(
      catchError(this.gererErreur)
    );
  }

  obtenirAssignationsVol(volNumero: number): Observable<Assignation[]> {
    return this.http.get<Assignation[]>(`${this.baseUrl}/vol/${volNumero}`).pipe(
      catchError(this.gererErreur)
    );
  }

  obtenirAssignationsActives(): Observable<Assignation[]> {
    return this.http.get<Assignation[]>(`${this.baseUrl}/actives`).pipe(
      catchError(this.gererErreur)
    );
  }

  libererPiste(assignationId: string): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${assignationId}/liberer`, {}).pipe(
      catchError(this.gererErreur)
    );
  }

  verifierDisponibilite(pisteId: string, heureDebut: string, heureFin: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/disponibilite/${pisteId}`, {
      params: { heureDebut, heureFin }
    }).pipe(
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
          messageErreur = 'Ressource non trouvée';
          break;
        case 409:
          messageErreur = 'Conflit: piste non disponible à cette heure';
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
