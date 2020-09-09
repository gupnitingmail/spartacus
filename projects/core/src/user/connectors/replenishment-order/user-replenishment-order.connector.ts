import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ReplenishmentOrderList } from '../../../model/replenishment-order.model';
import { OrderHistoryList, ReplenishmentOrder } from '../../../model/index';
import { UserReplenishmentOrderAdapter } from './user-replenishment-order.adapter';

@Injectable({
  providedIn: 'root',
})
export class UserReplenishmentOrderConnector {
  constructor(protected adapter: UserReplenishmentOrderAdapter) {}

  public load(
    userId: string,
    replenishmentOrderCode: string
  ): Observable<ReplenishmentOrder> {
    return this.adapter.load(userId, replenishmentOrderCode);
  }

  public loadReplenishmentDetailsHistory(
    userId: string,
    replenishmentOrderCode: string,
    pageSize?: number,
    currentPage?: number,
    sort?: string
  ): Observable<OrderHistoryList> {
    return this.adapter.loadReplenishmentDetailsHistory(
      userId,
      replenishmentOrderCode,
      pageSize,
      currentPage,
      sort
    );
  }

  public cancelReplenishmentOrder(
    userId: string,
    replenishmentOrderCode: string
  ): Observable<ReplenishmentOrder> {
    return this.adapter.cancelReplenishmentOrder(
      userId,
      replenishmentOrderCode
    );
  }

  public getHistory(
    userId: string,
    pageSize?: number,
    currentPage?: number,
    sort?: string
  ): Observable<ReplenishmentOrderList> {
    return this.adapter.loadHistory(userId, pageSize, currentPage, sort);
  }
}
