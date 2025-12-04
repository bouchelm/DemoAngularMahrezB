import { Observable } from 'rxjs';
import { Avion, AvionCreationRequest } from '../../types/avion';

export abstract class IProxyAvion {
  abstract obtenirAvion(immatriculation: string): Observable<Avion>;
  abstract obtenirTousLesAvions(): Observable<Avion[]>;
  abstract creerAvion(requete: AvionCreationRequest): Observable<Avion>;
  abstract modifierAvion(immatriculation: string, requete: AvionCreationRequest): Observable<Avion>;
  abstract supprimerAvion(immatriculation: string): Observable<void>;
  abstract assignerVol(immatriculation: string, numeroVol: number): Observable<void>;
}