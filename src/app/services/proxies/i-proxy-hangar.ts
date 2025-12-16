import { Observable } from 'rxjs';
import { Hangar, HangarCreationRequest } from '../../types/hangar';

export abstract class IProxyHangar {
  abstract obtenirHangar(identifiant: string): Observable<Hangar>;
  abstract obtenirTousLesHangars(): Observable<Hangar[]>;
  abstract creerHangar(requete: HangarCreationRequest): Observable<Hangar>;
  abstract modifierHangar(identifiant: string, requete: HangarCreationRequest): Observable<Hangar>;
  abstract supprimerHangar(identifiant: string): Observable<void>;
}
