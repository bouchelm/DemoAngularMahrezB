import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';

export interface DialogueAffectationData {
  vols: Array<{ numero: number; destination: string }>;
  pistes: Array<{ id: string; identifiant: string }>;
}

@Component({
  selector: 'app-dialogue-affectation',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  template: `
    <h2 mat-dialog-title>Affecter une piste</h2>
    <mat-dialog-content>
      <form [formGroup]="formulaireAffectation" class="affectation-form">
        <mat-form-field appearance="outline">
          <mat-label>Vol</mat-label>
          <mat-select formControlName="volNumero">
            @for (vol of data.vols; track vol.numero) {
              <mat-option [value]="vol.numero">{{ vol.numero }} - {{ vol.destination }}</mat-option>
            }
          </mat-select>
          @if (formulaireAffectation.get('volNumero')?.hasError('required')) {
            <mat-error>Veuillez sélectionner un vol</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Piste</mat-label>
          <mat-select formControlName="pisteId">
            @for (piste of data.pistes; track piste.id) {
              <mat-option [value]="piste.id">{{ piste.identifiant }}</mat-option>
            }
          </mat-select>
          @if (formulaireAffectation.get('pisteId')?.hasError('required')) {
            <mat-error>Veuillez sélectionner une piste</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Heure de début</mat-label>
          <input matInput type="datetime-local" formControlName="heureDebut">
          @if (formulaireAffectation.get('heureDebut')?.hasError('required')) {
            <mat-error>Heure de début requise</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Heure de fin</mat-label>
          <input matInput type="datetime-local" formControlName="heureFin">
          @if (formulaireAffectation.get('heureFin')?.hasError('required')) {
            <mat-error>Heure de fin requise</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Type de mouvement</mat-label>
          <mat-select formControlName="typeMouvement">
            <mat-option value="DEPART">Départ</mat-option>
            <mat-option value="ARRIVEE">Arrivée</mat-option>
          </mat-select>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="annuler()">Annuler</button>
      <button mat-raised-button color="primary" (click)="valider()" [disabled]="formulaireAffectation.invalid">
        Affecter
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .affectation-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
      min-width: 380px;
      padding-top: 8px;
    }
    mat-form-field {
      width: 100%;
    }
  `]
})
export class DialogueAffectationComponent {
  formulaireAffectation: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<DialogueAffectationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogueAffectationData
  ) {
    this.formulaireAffectation = this.fb.group({
      volNumero: ['', Validators.required],
      pisteId: ['', Validators.required],
      heureDebut: ['', Validators.required],
      heureFin: ['', Validators.required],
      typeMouvement: ['DEPART', Validators.required]
    });
  }

  annuler(): void {
    this.dialogRef.close();
  }

  valider(): void {
    if (this.formulaireAffectation.valid) {
      const valeurs = this.formulaireAffectation.value;
      this.dialogRef.close({
        volNumero: Number(valeurs.volNumero),
        pisteId: valeurs.pisteId,
        heureDebut: new Date(valeurs.heureDebut).toISOString(),
        heureFin: new Date(valeurs.heureFin).toISOString(),
        typeMouvement: valeurs.typeMouvement
      });
    }
  }
}
