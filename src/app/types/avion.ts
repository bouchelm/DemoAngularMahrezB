export enum TypeAvion {
  CARGO = 'CARGO',
  PASSAGERS = 'PASSAGERS',
  MILITAIRE = 'MILITAIRE'
}

export enum EtatAvion {
  AU_SOL = 'AU_SOL',
  MAINTENANCE = 'MAINTENANCE',
  EN_VOL = 'EN_VOL',
  AU_HANGAR = 'AU_HANGAR'
}

export interface Avion {
  immatriculation: string;
  type: TypeAvion;
  capacity: number;
  etat: EtatAvion;
  hangarId?: string | null;
  pisteId?: string | null;
}

export interface AvionCreationRequest {
  immatriculation: string;
  type: TypeAvion;
  capacity: number;
}