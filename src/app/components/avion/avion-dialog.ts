import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Avion, TypeAvion, EtatAvion } from '../../types/avion';

export interface AvionDialogData {
  avion?: Avion;
  isEdit: boolean;
}

@Component({
  selector: 'app-avion-dialog',
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
    <h2 mat-dialog-title>{{ data.isEdit ? 'Modifier' : 'Ajouter' }} un avion</h2>
    <mat-dialog-content>
      <form [formGroup]="form" class="avion-form">
        <mat-form-field appearance="outline">
          <mat-label>Immatriculation</mat-label>
          <input matInput formControlName="immatriculation" [readonly]="data.isEdit">
          @if (form.get('immatriculation')?.hasError('required')) {
            <mat-error>Immatriculation requise</mat-error>
          }
          @if (form.get('immatriculation')?.hasError('pattern')) {
            <mat-error>Format invalide (10 chiffres + 1 lettre ou 9 chiffres + 2 lettres)</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Type</mat-label>
          <mat-select formControlName="type">
            @for (t of typeOptions; track t) {
              <mat-option [value]="t">{{ t }}</mat-option>
            }
          </mat-select>
          @if (form.get('type')?.hasError('required')) {
            <mat-error>Type requis</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Capacité</mat-label>
          <input matInput type="number" formControlName="capacity">
          @if (form.get('capacity')?.hasError('required')) {
            <mat-error>Capacité requise</mat-error>
          }
          @if (form.get('capacity')?.hasError('min')) {
            <mat-error>La capacité doit être positive</mat-error>
          }
        </mat-form-field>

        @if (data.isEdit) {
          <mat-form-field appearance="outline">
            <mat-label>État</mat-label>
            <mat-select formControlName="etat">
              @for (e of etatOptions; track e) {
                <mat-option [value]="e">{{ e }}</mat-option>
              }
            </mat-select>
          </mat-form-field>
        }
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Annuler</button>
      <button mat-raised-button color="primary" (click)="onSubmit()" [disabled]="form.invalid">
        {{ data.isEdit ? 'Modifier' : 'Ajouter' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .avion-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
      min-width: 300px;
      padding-top: 8px;
    }
    mat-form-field {
      width: 100%;
    }
  `]
})
export class AvionDialogComponent {
  form: FormGroup;
  typeOptions = Object.values(TypeAvion);
  etatOptions = Object.values(EtatAvion);

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AvionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AvionDialogData
  ) {
    this.form = this.fb.group({
      immatriculation: [
        data.avion?.immatriculation || '',
        [Validators.required, Validators.pattern(/^(?:\d{10}[A-Za-z]|\d{9}[A-Za-z]{2})$/)]
      ],
      type: [data.avion?.type || '', Validators.required],
      capacity: [data.avion?.capacity || '', [Validators.required, Validators.min(1)]],
      etat: [data.avion?.etat || EtatAvion.AU_SOL]
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }
}
