import { Observable } from 'rxjs';

export interface Assignation {
  id: string;
  volNumero: number;
  pisteId: string;
  heureDebut: string;
  heureFin: string;
  typeMouvement: 'DEPART' | 'ARRIVEE';
}

export interface AssignationRequest {
  volNumero: number;
  pisteId: string;
  heureDebut: string;
  heureFin: string;
  typeMouvement: 'DEPART' | 'ARRIVEE';
}

export abstract class IProxyPlanification {
  abstract affecter(requete: AssignationRequest): Observable<Assignation>;
  abstract obtenirAssignationsPiste(pisteId: string): Observable<Assignation[]>;
  abstract obtenirAssignationsVol(volNumero: number): Observable<Assignation[]>;
  abstract obtenirAssignationsActives(): Observable<Assignation[]>;
  abstract libererPiste(assignationId: string): Observable<void>;
  abstract verifierDisponibilite(pisteId: string, heureDebut: string, heureFin: string): Observable<boolean>;
}
