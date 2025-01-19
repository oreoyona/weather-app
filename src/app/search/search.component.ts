import { Component, inject, model, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field'
import { AppComponent } from '../app.component';
import { MatInputModule } from '@angular/material/input';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { NgArrayPipesModule } from 'ngx-pipes';
import { City } from '../interfaces';


@Component({
  selector: 'app-search',
  standalone: true,
  imports: [MatDialogModule, CommonModule, NgArrayPipesModule, FormsModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatAutocompleteModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {
  cities!:any[];
  readonly dialogRef = inject(MatDialogRef<AppComponent>);
  readonly data = inject<any>(MAT_DIALOG_DATA);
  readonly city = model(this.data.city);
  cityOptions!: Observable<any>;

  onNoClick(): void {
    this.dialogRef.close();
  }
}
