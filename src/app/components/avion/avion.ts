import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AvionService } from '../../services/avion.service';
import { Avion } from '../../types/avion';
import { AvionDialogComponent, AvionDialogData } from './avion-dialog';
import { ConfirmDialogComponent, ConfirmDialogData } from './confirm-dialog';
import { AssignVolDialogComponent } from './assign-vol-dialog';

@Component({
  selector: 'app-avion',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTooltipModule
  ],
  templateUrl: './avion.html',
  styleUrl: './avion.css',
})
export class AvionComponent implements OnInit {
  displayedColumns: string[] = ['immatriculation', 'type', 'capacity', 'etat', 'actions'];
  avions: Avion[] = [];

  constructor(
    private avionService: AvionService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadAvions();
  }

  loadAvions(): void {
    this.avionService.getAvions().subscribe({
      next: (data) => this.avions = data,
      error: () => this.showSnackBar('Erreur lors du chargement des avions', true)
    });
  }

  openAddDialog(): void {
    const dialogData: AvionDialogData = { isEdit: false };
    const dialogRef = this.dialog.open(AvionDialogComponent, {
      data: dialogData,
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.avionService.createAvion({
          immatriculation: result.immatriculation,
          type: result.type,
          capacity: result.capacity
        }).subscribe({
          next: () => {
            this.showSnackBar('Avion ajouté avec succès');
            this.loadAvions();
          },
          error: () => this.showSnackBar('Erreur lors de l\'ajout', true)
        });
      }
    });
  }

  openEditDialog(avion: Avion): void {
    const dialogData: AvionDialogData = { avion, isEdit: true };
    const dialogRef = this.dialog.open(AvionDialogComponent, {
      data: dialogData,
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.avionService.updateAvion(avion.immatriculation, result).subscribe({
          next: () => {
            this.showSnackBar('Avion modifié avec succès');
            this.loadAvions();
          },
          error: () => this.showSnackBar('Erreur lors de la modification', true)
        });
      }
    });
  }

  openDeleteDialog(avion: Avion): void {
    const dialogData: ConfirmDialogData = {
      title: 'Supprimer l\'avion',
      message: `Voulez-vous vraiment supprimer l'avion ${avion.immatriculation} ?`
    };
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: dialogData,
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.avionService.deleteAvion(avion.immatriculation).subscribe({
          next: () => {
            this.showSnackBar('Avion supprimé avec succès');
            this.loadAvions();
          },
          error: () => this.showSnackBar('Erreur lors de la suppression', true)
        });
      }
    });
  }

  openAssignVolDialog(avion: Avion): void {
    const dialogRef = this.dialog.open(AssignVolDialogComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(volId => {
      if (volId) {
        this.avionService.assignerVol(avion.immatriculation, volId).subscribe({
          next: () => {
            this.showSnackBar('Avion assigné au vol avec succès');
            this.loadAvions();
          },
          error: () => this.showSnackBar('Erreur lors de l\'assignation', true)
        });
      }
    });
  }

  private showSnackBar(message: string, isError: boolean = false): void {
    this.snackBar.open(message, 'Fermer', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: isError ? ['error-snackbar'] : ['success-snackbar']
    });
  }
}
