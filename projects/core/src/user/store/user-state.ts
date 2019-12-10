import { Address, Country, Region } from '../../model/address.model';
import { PaymentDetails } from '../../model/cart.model';
import { ConsentTemplate } from '../../model/consent.model';
import { ConsignmentTracking } from '../../model/consignment-tracking.model';
import { Title, User } from '../../model/misc.model';
import {
  Order,
  OrderHistoryList,
  ReturnRequest,
  ReturnRequestList,
} from '../../model/order.model';
import { LoaderState } from '../../state';

export const USER_FEATURE = 'user';
export const UPDATE_EMAIL_PROCESS_ID = 'updateEmail';
export const UPDATE_PASSWORD_PROCESS_ID = 'updatePassword';
export const UPDATE_USER_DETAILS_PROCESS_ID = 'updateUserDetails';
export const REGISTER_USER_PROCESS_ID = 'registerUser';
export const REMOVE_USER_PROCESS_ID = 'removeUser';
export const GIVE_CONSENT_PROCESS_ID = 'giveConsent';
export const WITHDRAW_CONSENT_PROCESS_ID = 'withdrawConsent';

export const USER_CONSENTS = '[User] User Consents';
export const USER_PAYMENT_METHODS = '[User] User Payment Methods';
export const USER_ORDERS = '[User] User Orders';
export const USER_ADDRESSES = '[User] User Addresses';
export const USER_RETURN_REQUESTS = '[User] Order Return Requests';
export const USER_RETURN_REQUEST_DETAILS = '[User] Return Request Details';
export const USER_ORDER_DETAILS = '[User] User Order Details';
export const REGIONS = '[User] Regions';

export interface StateWithUser {
  [USER_FEATURE]: UserState;
}

export interface UserState {
  account: UserDetailsState;
  addresses: LoaderState<Address[]>;
  consents: LoaderState<ConsentTemplate[]>;
  billingCountries: BillingCountriesState;
  countries: DeliveryCountriesState;
  payments: LoaderState<PaymentDetails[]>;
  orders: LoaderState<OrderHistoryList>;
  order: LoaderState<Order>;
  orderReturn: LoaderState<ReturnRequest>;
  orderReturnList: LoaderState<ReturnRequestList>;
  titles: TitlesState;
  regions: LoaderState<RegionsState>;
  resetPassword: boolean;
  consignmentTracking: ConsignmentTrackingState;
}

export interface RegionsState {
  entities: Region[];
  country: string;
}

export interface BillingCountryEntities {
  [key: string]: Country;
}

export interface BillingCountriesState {
  entities: BillingCountryEntities;
}

export interface DeliveryCountryEntities {
  [key: string]: Country;
}

export interface DeliveryCountriesState {
  entities: DeliveryCountryEntities;
}

export interface TitleEntities {
  [key: string]: Title;
}

export interface TitlesState {
  entities: TitleEntities;
}

export interface UserDetailsState {
  details: User;
}

export interface ConsignmentTrackingState {
  tracking?: ConsignmentTracking;
}
