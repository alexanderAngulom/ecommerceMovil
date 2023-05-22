import { BaseEntity } from 'src/model/base-entity';
import { ProductCategory } from '../product-category/product-category.model';

export const enum Size {
  'S',
  'M',
  'L',
  'XL',
  'XXL',
}

export class Product implements BaseEntity {
  constructor(
    public id?: string,
    public name?: string,
    public description?: string,
    public price?: number,
    public productSize?: Size,
    public imageContentType?: string,
    public image?: any,
    public productCategory?: ProductCategory
  ) {}
}
