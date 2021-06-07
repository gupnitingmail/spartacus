import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CheckoutCostCenterAdapter } from '@spartacus/checkout/core';
import {
  Cart,
  CART_NORMALIZER,
  ConverterService,
  OccEndpointsService,
} from '@spartacus/core';
import { Observable } from 'rxjs';

@Injectable()
export class OccCheckoutCostCenterAdapter implements CheckoutCostCenterAdapter {
  constructor(
    protected http: HttpClient,
    protected occEndpoints: OccEndpointsService,
    protected converter: ConverterService
  ) {}

  setCostCenter(
    userId: string,
    cartId: string,
    costCenterId: string
  ): Observable<Cart> {
    let httpParams = new HttpParams().set('costCenterId', costCenterId);
    /* eslint-disable max-len */
    httpParams = httpParams.set(
      'fields',
      'DEFAULT,potentialProductPromotions,appliedProductPromotions,potentialOrderPromotions,appliedOrderPromotions,entries(totalPrice(formattedValue),product(images(FULL),stock(FULL)),basePrice(formattedValue,value),updateable),totalPrice(formattedValue),totalItems,totalPriceWithTax(formattedValue),totalDiscounts(value,formattedValue),subTotal(formattedValue),deliveryItemsQuantity,deliveryCost(formattedValue),totalTax(formattedValue, value),pickupItemsQuantity,net,appliedVouchers,productDiscounts(formattedValue),user'
    );
    // TODO(#8877): Should we improve configurable endpoints for this use case?

    return this.http
      .put(
        this.getCartEndpoint(userId) + cartId + '/costcenter',
        {},
        {
          params: httpParams,
        }
      )
      .pipe(this.converter.pipeable(CART_NORMALIZER));
  }

  protected getCartEndpoint(userId: string): string {
    const cartEndpoint = 'users/' + userId + '/carts/';
    return this.occEndpoints.getEndpoint(cartEndpoint);
  }
}