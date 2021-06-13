import { DpCheckoutPaymentService } from '../../../facade/dp-checkout-payment.service';
import { SpinnerModule } from '@spartacus/storefront';
import { DpPaymentFormComponent } from './dp-payment-form.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { I18nModule } from '@spartacus/core';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgSelectModule,
    I18nModule,
    SpinnerModule,
  ],

  declarations: [DpPaymentFormComponent],
  entryComponents: [DpPaymentFormComponent],
  exports: [DpPaymentFormComponent],
  providers: [DpCheckoutPaymentService],
})
export class DpPaymentFormModule {}