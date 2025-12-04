export enum TypeHangar {
  MILITAIRE = 'MILITAIRE',
  COMMERCIAL = 'COMMERCIAL'
}

export enum EtatHangar {
  OUVERT = 'OUVERT',
  FERME = 'FERME',
  MAINTENANCE = 'MAINTENANCE'
}

export interface Hangar {
  identifiant: string;
  type: TypeHangar;
  capacity: number;
  etat: EtatHangar;
  avionsIdentifiants?: string[];
}

export interface HangarCreationRequest {
  identifiant: string;
  type: TypeHangar;
  capacity: number;
  etat: EtatHangar;
}

export interface HangarUpdateRequest {
  type?: TypeHangar;
  capacity?: number;
  etat?: EtatHangar;
}