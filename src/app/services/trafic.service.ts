import { Injectable } from '@angular/core';
import { Observable, forkJoin, map } from 'rxjs';
import { Vol, StatutVol } from '../types/vol';
import { VolService } from './vol.service';

export interface StatistiquesTrafic {
  departsAujourdhui: number;
  arrivesAujourdhui: number;
  pistesOccupees: number;
  pistesTotales: number;
  prochainsDeparts: Vol[];
  prochainsArrivees: Vol[];
}

@Injectable({
  providedIn: 'root'
})
export class TraficService {
  constructor(private volService: VolService) {}

  obtenirDeparts(): Observable<Vol[]> {
    return this.volService.obtenirDeparts();
  }

  obtenirArrivees(): Observable<Vol[]> {
    return this.volService.obtenirArrivees();
  }

  calculerStatistiques(): Observable<StatistiquesTrafic> {
    return forkJoin([
      this.volService.obtenirDeparts(),
      this.volService.obtenirArrivees()
    ]).pipe(
      map(([departs, arrivees]) => {
        const statutsActifs = [StatutVol.PREVU, StatutVol.EN_ATTENTE, StatutVol.EMBARQUEMENT, StatutVol.DECOLLE];

        const departsActifs = departs.filter(v => statutsActifs.includes(v.statut));
        const arrivesActifs = arrivees.filter(v => statutsActifs.includes(v.statut));

        const prochainsDeparts = departsActifs
          .sort((a, b) => new Date(a.horaire).getTime() - new Date(b.horaire).getTime())
          .slice(0, 3);

        const prochainsArrivees = arrivesActifs
          .sort((a, b) => new Date(a.horaire).getTime() - new Date(b.horaire).getTime())
          .slice(0, 3);

        return {
          departsAujourdhui: departsActifs.length,
          arrivesAujourdhui: arrivesActifs.length,
          pistesOccupees: Math.floor(Math.random() * 5) + 1,
          pistesTotales: 8,
          prochainsDeparts,
          prochainsArrivees
        };
      })
    );
  }
}
