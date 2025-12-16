import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Piste, PisteCreationRequest, EtatPiste } from '../types/piste';
import { IProxyPiste } from './proxies/i-proxy-piste';
import { ProxyPisteReel } from './proxies/proxy-piste-reel';

@Injectable({
  providedIn: 'root'
})
export class PisteService {
  private proxy: IProxyPiste;

  constructor(proxyPiste: ProxyPisteReel) {
    this.proxy = proxyPiste;
  }

  chargerPistes(): Observable<Piste[]> {
    return this.proxy.obtenirToutesPistes();
  }

  obtenirPiste(identifiant: string): Observable<Piste> {
    return this.proxy.obtenirPiste(identifiant);
  }

  creerPiste(requete: PisteCreationRequest): Observable<Piste> {
    return this.proxy.creerPiste(requete);
  }

  modifierPiste(identifiant: string, requete: PisteCreationRequest): Observable<Piste> {
    return this.proxy.modifierPiste(identifiant, requete);
  }

  supprimerPiste(identifiant: string): Observable<void> {
    return this.proxy.supprimerPiste(identifiant);
  }

  compterPistesParEtat(pistes: Piste[]): { total: number; libres: number; occupees: number; maintenance: number } {
    return {
      total: pistes.length,
      libres: pistes.filter(p => p.etat === EtatPiste.LIBRE).length,
      occupees: pistes.filter(p => p.etat === EtatPiste.OCCUPEE).length,
      maintenance: pistes.filter(p => p.etat === EtatPiste.EN_MAINTENANCE).length
    };
  }
}
