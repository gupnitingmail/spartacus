import { Component, EventEmitter, Input, DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { cold, getTestScheduler, hot } from 'jasmine-marbles';
import {
  CartService,
  I18nTestingModule,
  Voucher,
  Cart,
  CartVoucherService,
} from '@spartacus/core';
import { of } from 'rxjs';
import { CartCouponAnchorService } from './cart-coupon-anchor/cart-coupon-anchor.service';
import { CartCouponComponent } from './cart-coupon.component';
import { ICON_TYPE } from '@spartacus/storefront';

@Component({
  selector: 'cx-icon',
  template: '',
})
class MockCxIconComponent {
  @Input() type: ICON_TYPE;
}

@Component({
  selector: 'cx-cart-coupon-anchor',
  template: '',
})
class MockCartCouponAnchorComponentComponent {}

@Component({
  selector: 'cx-applied-coupons',
  template: '',
})
class MockAppliedCouponsComponent {
  @Input()
  vouchers: Voucher[];
  @Input()
  cartIsLoading = false;
  @Input()
  isReadOnly = false;
}

describe('CartCouponComponent', () => {
  let component: CartCouponComponent;
  let fixture: ComponentFixture<CartCouponComponent>;
  let cartCouponAnchorService;
  let input: HTMLInputElement;
  let el: DebugElement;
  const emitter = new EventEmitter<string>();

  const mockCartService = jasmine.createSpyObj('CartService', [
    'getActive',
    'getLoaded',
  ]);

  const mockCartVoucherService = jasmine.createSpyObj('CartVoucherService', [
    'addVoucher',
    'getAddVoucherResultSuccess',
    'resetAddVoucherProcessingState',
    'getAddVoucherResultLoading',
  ]);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [I18nTestingModule, ReactiveFormsModule],
      declarations: [
        CartCouponComponent,
        MockAppliedCouponsComponent,
        MockCxIconComponent,
        MockCartCouponAnchorComponentComponent,
      ],
      providers: [
        { provide: CartService, useValue: mockCartService },
        { provide: CartVoucherService, useValue: mockCartVoucherService },
        CartCouponAnchorService,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CartCouponComponent);
    component = fixture.componentInstance;
    el = fixture.debugElement;
    cartCouponAnchorService = TestBed.get(CartCouponAnchorService);
    spyOn(cartCouponAnchorService, 'getEventEmit').and.returnValue(emitter);

    mockCartService.getActive.and.returnValue(of<Cart>({ code: '123' }));
    mockCartService.getLoaded.and.returnValue(of(true));
    mockCartVoucherService.getAddVoucherResultSuccess.and.returnValue(of());
    mockCartVoucherService.getAddVoucherResultLoading.and.returnValue(of());
    mockCartVoucherService.addVoucher.and.stub();
    mockCartVoucherService.resetAddVoucherProcessingState.and.stub();
    mockCartVoucherService.resetAddVoucherProcessingState.calls.reset();
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should show coupon input and submit buttom', () => {
    mockCartVoucherService.getAddVoucherResultLoading.and.returnValue(
      of(false)
    );
    fixture.detectChanges();

    expect(el.query(By.css('[data-test="title-coupon"]'))).toBeTruthy();
    expect(el.query(By.css('[data-test="input-coupon"]'))).toBeTruthy();
    expect(el.query(By.css('[data-test="button-coupon"]'))).toBeTruthy();
    expect(
      el.query(By.css('[data-test="button-coupon"]')).nativeElement.disabled
    ).toBeTruthy();
  });

  it('should form is valid when inputting coupon code', () => {
    fixture.detectChanges();
    expect(component.form.valid).toBeFalsy();

    input = el.query(By.css('[data-test="input-coupon"]')).nativeElement;
    input.value = 'couponCode1';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(component.form.valid).toBeTruthy();
  });

  fit('should enable button when inputting coupon code', () => {
    mockCartVoucherService.getAddVoucherResultLoading.and.returnValue(
      of(false)
    );
    fixture.detectChanges();

    const applyBtn = el.query(By.css('[data-test="button-coupon"]'))
      .nativeElement;
    expect(applyBtn.disabled).toBeTruthy();

    input = el.query(By.css('[data-test="input-coupon"]')).nativeElement;
    input.value = 'couponCode1';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(applyBtn.disabled).toBeFalsy();
  });

  it('should disable button when coupon is in process', () => {
    mockCartVoucherService.getAddVoucherResultLoading.and.returnValue(
      hot('-a', { a: true })
    );
    fixture.detectChanges();

    const applyBtn = el.query(By.css('[data-test="button-coupon"]'))
      .nativeElement;

    input = el.query(By.css('[data-test="input-coupon"]')).nativeElement;
    input.value = 'couponCode1';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    mockCartVoucherService.getAddVoucherResultLoading.and.returnValue(
      cold('-a', { a: true })
    );
    applyBtn.click();

    getTestScheduler().flush();
    fixture.detectChanges();

    expect(mockCartVoucherService.addVoucher).toHaveBeenCalled();
    expect(applyBtn.disabled).toBeTruthy();
  });

  it('should coupon is applied successfully', () => {
    mockCartVoucherService.getAddVoucherResultLoading.and.returnValue(of(true));
    mockCartVoucherService.getAddVoucherResultSuccess.and.returnValue(of(true));

    fixture.detectChanges();

    input = el.query(By.css('[data-test="input-coupon"]')).nativeElement;
    input.value = 'couponCode1';
    el.query(By.css('[data-test="button-coupon"]')).nativeElement.click();

    expect(
      el.query(By.css('[data-test="button-coupon"]')).nativeElement.disabled
    ).toBeTruthy();
    expect(input.readOnly).toBeFalsy();
  });

  it('should disable button when apply coupon failed', () => {
    mockCartVoucherService.getAddVoucherResultLoading.and.returnValue(
      of(false)
    );
    mockCartVoucherService.getAddVoucherResultSuccess.and.returnValue(
      of(false)
    );
    fixture.detectChanges();

    input = el.query(By.css('[data-test="input-coupon"]')).nativeElement;
    expect(input.readOnly).toBeFalsy();

    const button = el.query(By.css('[data-test="button-coupon"]'))
      .nativeElement;
    expect(button.disabled).toBeTruthy();
  });

  it('should reset state when ondestory is triggered', () => {
    mockCartVoucherService.getAddVoucherResultLoading.and.returnValue(of(true));
    mockCartVoucherService.getAddVoucherResultSuccess.and.returnValue(of(true));
    fixture.detectChanges();

    component.ngOnDestroy();
    expect(
      mockCartVoucherService.resetAddVoucherProcessingState
    ).toHaveBeenCalled();
  });
});
