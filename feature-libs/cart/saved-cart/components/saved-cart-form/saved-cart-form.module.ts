import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { I18nModule } from '@spartacus/core';
import { FormErrorsModule, IconModule } from '@spartacus/storefront';
import { SavedCartFormComponent } from './saved-cart-form.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FormErrorsModule,
    I18nModule,
    IconModule,
  ],
  declarations: [SavedCartFormComponent],
  exports: [SavedCartFormComponent],
})
export class SavedCartFormModule {}