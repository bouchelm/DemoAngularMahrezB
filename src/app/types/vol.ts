export enum StatutVol {
  PREVU = 'PREVU',
  EN_ATTENTE = 'EN_ATTENTE',
  EMBARQUEMENT = 'EMBARQUEMENT',
  DECOLLE = 'DECOLLE',
  EN_VOL = 'EN_VOL',
  ARRIVE = 'ARRIVE',
  ANNULE = 'ANNULE'
}

export enum Ville {
  GRENOBLE = 'GRENOBLE',
  PARIS = 'PARIS',
  LYON = 'LYON',
  LONDRES = 'LONDRES',
  BERLIN = 'BERLIN',
  MADRID = 'MADRID',
  NEWYORK = 'NEWYORK',
  PEKIN = 'PEKIN',
  TOKYO = 'TOKYO',
  LOS_ANGELES = 'LOS_ANGELES',
  MEXICO = 'MEXICO',
  RIO_DE_JANEIRO = 'RIO_DE_JANEIRO',
  ALGER = 'ALGER',
  CONAKRY = 'CONAKRY'
}

export interface Vol {
  numero: number;
  origine: Ville;
  destination: Ville;
  horaire: string; 
  statut: StatutVol;
  avionImmatriculation?: string | null;
}

export interface VolCreationRequest {
  numero: number;
  origine: Ville;
  destination: Ville;
  horaire: string; 
  statut?: StatutVol;
  avionImmatriculation?: string;
}

export interface VolUpdateRequest {
  origine?: Ville;
  destination?: Ville;
  horaire?: string;
  statut?: StatutVol;
  avionImmatriculation?: string;
}