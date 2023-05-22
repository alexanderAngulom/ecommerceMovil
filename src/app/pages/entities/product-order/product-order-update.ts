import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder as FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ProductOrder } from './product-order.model';
import { ProductOrderService } from './product-order.service';
import { Product, ProductService } from '../product';
import { ShoppingCart, ShoppingCartService } from '../shopping-cart';

@Component({
  selector: 'page-product-order-update',
  templateUrl: 'product-order-update.html',
})
export class ProductOrderUpdatePage implements OnInit {
  productOrder: ProductOrder;
  products: Product[];
  shoppingCarts: ShoppingCart[];
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [null, []],
    quantity: [null, [Validators.required]],
    totalPrice: [null, [Validators.required]],
    product: [null, [Validators.required]],
    cart: [null, [Validators.required]],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    protected formBuilder: FormBuilder,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private productService: ProductService,
    private shoppingCartService: ShoppingCartService,
    private productOrderService: ProductOrderService
  ) {
    // Watch the form for changes, and
    this.form.valueChanges.subscribe(v => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ngOnInit() {
    this.productService.query().subscribe(
      data => {
        this.products = data.body;
      },
      error => this.onError(error)
    );
    this.shoppingCartService.query().subscribe(
      data => {
        this.shoppingCarts = data.body;
      },
      error => this.onError(error)
    );
    this.activatedRoute.data.subscribe(response => {
      this.productOrder = response.data;
      this.isNew = this.productOrder.id === null || this.productOrder.id === undefined;
      this.updateForm(this.productOrder);
    });
  }

  updateForm(productOrder: ProductOrder) {
    this.form.patchValue({
      id: productOrder.id,
      quantity: productOrder.quantity,
      totalPrice: productOrder.totalPrice,
      product: productOrder.product,
      cart: productOrder.cart,
    });
  }

  save() {
    this.isSaving = true;
    const productOrder = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.productOrderService.update(productOrder));
    } else {
      this.subscribeToSaveResponse(this.productOrderService.create(productOrder));
    }
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `ProductOrder ${action} successfully.`, duration: 2000, position: 'middle' });
    await toast.present();
    await this.navController.navigateBack('/tabs/entities/product-order');
  }

  previousState() {
    window.history.back();
  }

  async onError(error) {
    this.isSaving = false;
    console.error(error);
    const toast = await this.toastCtrl.create({ message: 'Failed to load data', duration: 2000, position: 'middle' });
    await toast.present();
  }

  compareProduct(first: Product, second: Product): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackProductById(index: number, item: Product) {
    return item.id;
  }
  compareShoppingCart(first: ShoppingCart, second: ShoppingCart): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackShoppingCartById(index: number, item: ShoppingCart) {
    return item.id;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ProductOrder>>) {
    result.subscribe(
      (res: HttpResponse<ProductOrder>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  private createFromForm(): ProductOrder {
    return {
      ...new ProductOrder(),
      id: this.form.get(['id']).value,
      quantity: this.form.get(['quantity']).value,
      totalPrice: this.form.get(['totalPrice']).value,
      product: this.form.get(['product']).value,
      cart: this.form.get(['cart']).value,
    };
  }
}
