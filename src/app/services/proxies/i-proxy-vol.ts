import { Observable } from 'rxjs';
import { Vol, VolCreationRequest } from '../../types/vol';

export abstract class IProxyVol {
  abstract obtenirVol(numero: number): Observable<Vol>;
  abstract obtenirDeparts(): Observable<Vol[]>;
  abstract obtenirArrivees(): Observable<Vol[]>;
  abstract creerVol(requete: VolCreationRequest): Observable<Vol>;
  abstract modifierVol(numero: number, requete: VolCreationRequest): Observable<Vol>;
  abstract supprimerVol(numero: number): Observable<void>;
}