import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { StateWithClientAuth } from '../../auth/client-auth/store/client-auth-state';
import { AuthService } from '../../auth/user-auth/facade/auth.service';
import { CxOAuthService } from '../../auth/user-auth/facade/cx-oauth-service';
import { UserIdService } from '../../auth/user-auth/facade/user-id.service';
import { AuthRedirectService } from '../../auth/user-auth/guards/auth-redirect.service';
import { AuthActions } from '../../auth/user-auth/store/actions/index';
import {
  OCC_USER_ID_ANONYMOUS,
  OCC_USER_ID_CURRENT,
} from '../../occ/utils/occ-constants';
import { AsmAuthStorageService, TokenTarget } from './asm-auth-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AsmAuthService extends AuthService {
  constructor(
    protected store: Store<StateWithClientAuth>,
    protected userIdService: UserIdService,
    protected cxOAuthService: CxOAuthService,
    protected authStorageService: AsmAuthStorageService,
    protected authRedirectService: AuthRedirectService
  ) {
    super(
      store,
      userIdService,
      cxOAuthService,
      authStorageService,
      authRedirectService
    );
  }

  public authorize(userId: string, password: string): void {
    let tokenTarget;
    let token;
    this.authStorageService
      .getToken()
      .subscribe((tok) => (token = tok))
      .unsubscribe();
    this.authStorageService
      .getTokenTarget()
      .subscribe((tokTarget) => (tokenTarget = tokTarget))
      .unsubscribe();
    if (Boolean(token?.access_token) && tokenTarget === TokenTarget.CSAgent) {
      // TODO: Show the warning that you cannot login when you are already logged in
    } else {
      super.authorize(userId, password);
    }
  }

  /**
   * Logout a storefront customer
   */
  public logout(): Promise<any> {
    let isEmulated;
    this.userIdService
      .isEmulated()
      .subscribe((emulated) => (isEmulated = emulated))
      .unsubscribe();
    if (isEmulated) {
      return new Promise((resolve) => {
        this.authStorageService.clearEmulatedUserToken();
        this.userIdService.clearUserId();
        this.store.dispatch(new AuthActions.Logout());
        // TODO: We should redirect to logout or home page?
        resolve();
      });
    } else {
      return super.logout();
    }
  }

  public isUserLoggedIn(): Observable<boolean> {
    return combineLatest([
      this.authStorageService.getToken(),
      this.userIdService.isEmulated(),
      this.authStorageService.getTokenTarget(),
    ]).pipe(
      map(
        ([token, isEmulated, tokenTarget]) =>
          (tokenTarget === TokenTarget.User && Boolean(token?.access_token)) ||
          (tokenTarget === TokenTarget.CSAgent &&
            Boolean(token?.access_token) &&
            isEmulated)
      )
    );
  }

  initImplicit() {
    setTimeout(() => {
      let tokenTarget;
      this.authStorageService
        .getTokenTarget()
        .subscribe((target) => {
          tokenTarget = target;
        })
        .unsubscribe();

      // TODO: For csagent target store emulated token

      this.cxOAuthService.tryLogin().then((result) => {
        console.log(result);
        if (result) {
          if (tokenTarget === TokenTarget.User) {
            this.userIdService.setUserId(OCC_USER_ID_CURRENT);
            this.store.dispatch(new AuthActions.Login());
            // TODO: Can we do it better? With the first redirect like with context? Why it only works if it is with this big timeout
            setTimeout(() => {
              this.authRedirectService.redirect();
            }, 10);
          } else {
            // TODO: Set emulated token and try to start the emulated session instantly
            this.userIdService.setUserId(OCC_USER_ID_ANONYMOUS);
          }
        } else {
          // this.cxOAuthService.silentRefresh();
        }
      });
    });
  }
}
