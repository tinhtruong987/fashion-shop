import { ProductState } from './product/product.reducer';
import { CustomerState } from './customer/customer.reducer';
import { POSState } from './pos/pos.reducer';

export interface AppState {
  products: ProductState;
  customers: CustomerState;
  pos: POSState;
}
