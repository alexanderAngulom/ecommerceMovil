import { BaseEntity } from 'src/model/base-entity';
import { Product } from '../product/product.model';
import { ShoppingCart } from '../shopping-cart/shopping-cart.model';

export class ProductOrder implements BaseEntity {
  constructor(
    public id?: string,
    public quantity?: number,
    public totalPrice?: number,
    public product?: Product,
    public cart?: ShoppingCart
  ) {}
}
