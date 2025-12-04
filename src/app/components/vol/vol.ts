import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { VolService } from '../../services/vol.service';
import { Vol, StatutVol, Ville } from '../../types/vol';
import { DialogueVolComponent, DialogueVolData } from './dialogue-vol.component';
import { ConfirmDialogComponent, ConfirmDialogData } from '../avion/confirm-dialog';

@Component({
  selector: 'app-vol',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatSelectModule,
    MatFormFieldModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTooltipModule
  ],
  templateUrl: './vol.html',
  styleUrl: './vol.css',
})
export class VolComponent implements OnInit {
  colonnesAffichees: string[] = ['numero', 'origine', 'destination', 'horaire', 'statut', 'avion', 'actions'];
  mesVols: Vol[] = [];
  volsFiltres: Vol[] = [];

  nombreTotal = 0;
  nombreEnCours = 0;
  nombrePrevus = 0;
  nombreTermines = 0;

  filtreStatut: StatutVol | null = null;
  filtreOrigine: Ville | null = null;
  filtreDestination: Ville | null = null;

  statuts = Object.values(StatutVol);
  villes = Object.values(Ville);

  constructor(
    private volService: VolService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.chargerVols();
  }

  chargerVols(): void {
    this.volService.chargerVols().subscribe({
      next: (data) => {
        this.mesVols = data;
        this.mettreAJourStatistiques();
        this.appliquerFiltres();
      },
      error: () => this.afficherMessage('Erreur lors du chargement des vols', true)
    });
  }

  mettreAJourStatistiques(): void {
    const stats = this.volService.compterVolsParStatut(this.mesVols);
    this.nombreTotal = stats.total;
    this.nombreEnCours = stats.enCours;
    this.nombrePrevus = stats.prevus;
    this.nombreTermines = stats.termines;
  }

  appliquerFiltres(): void {
    this.volsFiltres = this.volService.filtrerVols(
      this.mesVols,
      this.filtreStatut,
      this.filtreOrigine,
      this.filtreDestination
    );
  }

  reinitialiserFiltres(): void {
    this.filtreStatut = null;
    this.filtreOrigine = null;
    this.filtreDestination = null;
    this.appliquerFiltres();
  }

  ouvrirDialogueAjout(): void {
    const dialogData: DialogueVolData = { estModification: false };
    const dialogRef = this.dialog.open(DialogueVolComponent, {
      data: dialogData,
      width: '450px'
    });

    dialogRef.afterClosed().subscribe(resultat => {
      if (resultat) {
        this.volService.creerVol(resultat).subscribe({
          next: () => {
            this.afficherMessage('Vol ajouté avec succès');
            this.chargerVols();
          },
          error: () => this.afficherMessage('Erreur lors de l\'ajout', true)
        });
      }
    });
  }

  ouvrirDialogueModification(vol: Vol): void {
    const dialogData: DialogueVolData = { vol, estModification: true };
    const dialogRef = this.dialog.open(DialogueVolComponent, {
      data: dialogData,
      width: '450px'
    });

    dialogRef.afterClosed().subscribe(resultat => {
      if (resultat) {
        this.volService.modifierVol(vol.numero, resultat).subscribe({
          next: () => {
            this.afficherMessage('Vol modifié avec succès');
            this.chargerVols();
          },
          error: () => this.afficherMessage('Erreur lors de la modification', true)
        });
      }
    });
  }

  confirmerSuppression(vol: Vol): void {
    const dialogData: ConfirmDialogData = {
      title: 'Supprimer le vol',
      message: `Voulez-vous vraiment supprimer le vol n°${vol.numero} ?`
    };
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: dialogData,
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(confirme => {
      if (confirme) {
        this.volService.supprimerVol(vol.numero).subscribe({
          next: () => {
            this.afficherMessage('Vol supprimé avec succès');
            this.chargerVols();
          },
          error: () => this.afficherMessage('Erreur lors de la suppression', true)
        });
      }
    });
  }

  formaterHoraire(horaire: string): string {
    const date = new Date(horaire);
    return date.toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  private afficherMessage(message: string, estErreur: boolean = false): void {
    this.snackBar.open(message, 'Fermer', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: estErreur ? ['error-snackbar'] : ['success-snackbar']
    });
  }
}
