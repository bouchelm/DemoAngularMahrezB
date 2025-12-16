import { Observable } from 'rxjs';
import { Piste, PisteCreationRequest } from '../../types/piste';

export abstract class IProxyPiste {
  abstract obtenirPiste(identifiant: string): Observable<Piste>;
  abstract obtenirToutesPistes(): Observable<Piste[]>;
  abstract creerPiste(requete: PisteCreationRequest): Observable<Piste>;
  abstract modifierPiste(identifiant: string, requete: PisteCreationRequest): Observable<Piste>;
  abstract supprimerPiste(identifiant: string): Observable<void>;
}
