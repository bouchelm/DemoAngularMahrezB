import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Vol, VolCreationRequest } from '../types/vol';
import { IProxyVol } from './proxies/i-proxy-vol';
import { ProxyVolReel } from './proxies/proxy-vol-reel';

@Injectable({
  providedIn: 'root'
})
export class VolService {
  private proxy: IProxyVol;

  constructor(proxyVol: ProxyVolReel) {
    this.proxy = proxyVol;
  }

  chargerVols(): Observable<Vol[]> {
    return this.proxy.obtenirDeparts();
  }

  chargerDeparts(): Observable<Vol[]> {
    return this.proxy.obtenirDeparts();
  }

  chargerArrivees(): Observable<Vol[]> {
    return this.proxy.obtenirArrivees();
  }

  obtenirVol(numero: number): Observable<Vol> {
    return this.proxy.obtenirVol(numero);
  }

  creerVol(requete: VolCreationRequest): Observable<Vol> {
    return this.proxy.creerVol(requete);
  }

  modifierVol(numero: number, requete: VolCreationRequest): Observable<Vol> {
    return this.proxy.modifierVol(numero, requete);
  }

  supprimerVol(numero: number): Observable<void> {
    return this.proxy.supprimerVol(numero);
  }

  compterVolsParStatut(vols: Vol[]): Record<string, number> {
    return vols.reduce((acc, vol) => {
      acc[vol.statut] = (acc[vol.statut] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  filtrerVols(vols: Vol[], critere: string): Vol[] {
    if (!critere) return vols;
    const recherche = critere.toLowerCase();
    return vols.filter(vol => 
      vol.numero.toString().includes(recherche) ||
      vol.origine?.toLowerCase().includes(recherche) ||
      vol.destination?.toLowerCase().includes(recherche) ||
      vol.statut?.toLowerCase().includes(recherche)
    );
  }
}