import { BaseEntity } from 'src/model/base-entity';
import { User } from '../../../services/user/user.model';
import { ShoppingCart } from '../shopping-cart/shopping-cart.model';

export const enum Gender {
  'MALE',
  'FEMALE',
  'OTHER',
}

export class CustomerDetails implements BaseEntity {
  constructor(
    public id?: string,
    public gender?: Gender,
    public phone?: string,
    public addressLine1?: string,
    public addressLine2?: string,
    public city?: string,
    public country?: string,
    public user?: User,
    public carts?: ShoppingCart[]
  ) {}
}
