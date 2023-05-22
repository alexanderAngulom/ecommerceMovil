import { BaseEntity } from 'src/model/base-entity';
import { ProductOrder } from '../product-order/product-order.model';
import { CustomerDetails } from '../customer-details/customer-details.model';

export const enum OrderStatus {
  'COMPLETED',
  'PAID',
  'PENDING',
  'CANCELLED',
  'REFUNDED',
}

export const enum PaymentMethod {
  'CREDIT_CARD (card)',
  'IDEAL (ideal)',
}

export class ShoppingCart implements BaseEntity {
  constructor(
    public id?: string,
    public placedDate?: any,
    public status?: OrderStatus,
    public totalPrice?: number,
    public paymentMethod?: PaymentMethod,
    public paymentReference?: string,
    public orders?: ProductOrder[],
    public customerDetails?: CustomerDetails
  ) {}
}
