import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Hangar, HangarCreationRequest, EtatHangar } from '../types/hangar';
import { IProxyHangar } from './proxies/i-proxy-hangar';
import { ProxyHangarReel } from './proxies/proxy-hangar-reel';

@Injectable({
  providedIn: 'root'
})
export class HangarService {
  private proxy: IProxyHangar;

  constructor(proxyHangar: ProxyHangarReel) {
    this.proxy = proxyHangar;
  }

  chargerHangars(): Observable<Hangar[]> {
    return this.proxy.obtenirTousLesHangars();
  }

  obtenirHangar(identifiant: string): Observable<Hangar> {
    return this.proxy.obtenirHangar(identifiant);
  }

  creerHangar(requete: HangarCreationRequest): Observable<Hangar> {
    return this.proxy.creerHangar(requete);
  }

  modifierHangar(identifiant: string, requete: HangarCreationRequest): Observable<Hangar> {
    return this.proxy.modifierHangar(identifiant, requete);
  }

  supprimerHangar(identifiant: string): Observable<void> {
    return this.proxy.supprimerHangar(identifiant);
  }

  compterHangarsParEtat(hangars: Hangar[]): { total: number; ouverts: number; fermes: number; maintenance: number } {
    return {
      total: hangars.length,
      ouverts: hangars.filter(h => h.etat === EtatHangar.OUVERT).length,
      fermes: hangars.filter(h => h.etat === EtatHangar.FERME).length,
      maintenance: hangars.filter(h => h.etat === EtatHangar.MAINTENANCE).length
    };
  }
}
