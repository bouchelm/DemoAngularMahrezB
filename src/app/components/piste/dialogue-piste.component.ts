import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Piste, EtatPiste } from '../../types/piste';

export interface DialoguePisteData {
  piste?: Piste;
  estModification: boolean;
}

@Component({
  selector: 'app-dialogue-piste',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data.estModification ? 'Modifier' : 'Ajouter' }} une piste</h2>
    <mat-dialog-content>
      <form [formGroup]="formulairePiste" class="piste-form">
        <mat-form-field appearance="outline">
          <mat-label>Identifiant</mat-label>
          <input matInput formControlName="identifiant" [readonly]="data.estModification">
          @if (formulairePiste.get('identifiant')?.hasError('required')) {
            <mat-error>Identifiant requis</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Longueur (m)</mat-label>
          <input matInput type="number" formControlName="longueur">
          @if (formulairePiste.get('longueur')?.hasError('required')) {
            <mat-error>Longueur requise</mat-error>
          }
          @if (formulairePiste.get('longueur')?.hasError('min')) {
            <mat-error>La longueur doit être positive</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>État</mat-label>
          <mat-select formControlName="etat">
            @for (e of etats; track e) {
              <mat-option [value]="e">{{ e }}</mat-option>
            }
          </mat-select>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="annuler()">Annuler</button>
      <button mat-raised-button color="primary" (click)="valider()" [disabled]="formulairePiste.invalid">
        {{ data.estModification ? 'Modifier' : 'Ajouter' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .piste-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
      min-width: 350px;
      padding-top: 8px;
    }
    mat-form-field {
      width: 100%;
    }
  `]
})
export class DialoguePisteComponent {
  formulairePiste: FormGroup;
  etats = Object.values(EtatPiste);

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<DialoguePisteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialoguePisteData
  ) {
    this.formulairePiste = this.fb.group({
      identifiant: [data.piste?.identifiant || '', Validators.required],
      longueur: [data.piste?.longueur || '', [Validators.required, Validators.min(1)]],
      etat: [data.piste?.etat || EtatPiste.LIBRE]
    });
  }

  annuler(): void {
    this.dialogRef.close();
  }

  valider(): void {
    if (this.formulairePiste.valid) {
      this.dialogRef.close(this.formulairePiste.value);
    }
  }
}
