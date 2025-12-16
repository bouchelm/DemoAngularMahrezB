import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IProxyPlanification, Assignation, AssignationRequest } from './proxies/i-proxy-planification';
import { ProxyPlanificationReel } from './proxies/proxy-planification-reel';

@Injectable({
  providedIn: 'root'
})
export class PlanificationPisteService {
  private proxy: IProxyPlanification;

  constructor(proxyPlanification: ProxyPlanificationReel) {
    this.proxy = proxyPlanification;
  }

  affecter(requete: AssignationRequest): Observable<Assignation> {
    return this.proxy.affecter(requete);
  }

  obtenirAssignationsPiste(pisteId: string): Observable<Assignation[]> {
    return this.proxy.obtenirAssignationsPiste(pisteId);
  }

  obtenirAssignationsVol(volNumero: number): Observable<Assignation[]> {
    return this.proxy.obtenirAssignationsVol(volNumero);
  }

  obtenirAssignationsActives(): Observable<Assignation[]> {
    return this.proxy.obtenirAssignationsActives();
  }

  libererPiste(assignationId: string): Observable<void> {
    return this.proxy.libererPiste(assignationId);
  }

  verifierDisponibilite(pisteId: string, heureDebut: string, heureFin: string): Observable<boolean> {
    return this.proxy.verifierDisponibilite(pisteId, heureDebut, heureFin);
  }
}
