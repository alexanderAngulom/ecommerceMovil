import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder as FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ShoppingCart } from './shopping-cart.model';
import { ShoppingCartService } from './shopping-cart.service';
import { CustomerDetails, CustomerDetailsService } from '../customer-details';

@Component({
  selector: 'page-shopping-cart-update',
  templateUrl: 'shopping-cart-update.html',
})
export class ShoppingCartUpdatePage implements OnInit {
  shoppingCart: ShoppingCart;
  customerDetails: CustomerDetails[];
  placedDate: string;
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [null, []],
    placedDate: [null, [Validators.required]],
    status: [null, [Validators.required]],
    totalPrice: [null, [Validators.required]],
    paymentMethod: [null, [Validators.required]],
    paymentReference: [null, []],
    customerDetails: [null, [Validators.required]],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    protected formBuilder: FormBuilder,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private customerDetailsService: CustomerDetailsService,
    private shoppingCartService: ShoppingCartService
  ) {
    // Watch the form for changes, and
    this.form.valueChanges.subscribe(v => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ngOnInit() {
    this.customerDetailsService.query().subscribe(
      data => {
        this.customerDetails = data.body;
      },
      error => this.onError(error)
    );
    this.activatedRoute.data.subscribe(response => {
      this.shoppingCart = response.data;
      this.isNew = this.shoppingCart.id === null || this.shoppingCart.id === undefined;
      this.updateForm(this.shoppingCart);
    });
  }

  updateForm(shoppingCart: ShoppingCart) {
    this.form.patchValue({
      id: shoppingCart.id,
      placedDate: this.isNew ? new Date().toISOString() : shoppingCart.placedDate,
      status: shoppingCart.status,
      totalPrice: shoppingCart.totalPrice,
      paymentMethod: shoppingCart.paymentMethod,
      paymentReference: shoppingCart.paymentReference,
      customerDetails: shoppingCart.customerDetails,
    });
  }

  save() {
    this.isSaving = true;
    const shoppingCart = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.shoppingCartService.update(shoppingCart));
    } else {
      this.subscribeToSaveResponse(this.shoppingCartService.create(shoppingCart));
    }
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `ShoppingCart ${action} successfully.`, duration: 2000, position: 'middle' });
    await toast.present();
    await this.navController.navigateBack('/tabs/entities/shopping-cart');
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

  compareCustomerDetails(first: CustomerDetails, second: CustomerDetails): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackCustomerDetailsById(index: number, item: CustomerDetails) {
    return item.id;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ShoppingCart>>) {
    result.subscribe(
      (res: HttpResponse<ShoppingCart>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  private createFromForm(): ShoppingCart {
    return {
      ...new ShoppingCart(),
      id: this.form.get(['id']).value,
      placedDate: new Date(this.form.get(['placedDate']).value),
      status: this.form.get(['status']).value,
      totalPrice: this.form.get(['totalPrice']).value,
      paymentMethod: this.form.get(['paymentMethod']).value,
      paymentReference: this.form.get(['paymentReference']).value,
      customerDetails: this.form.get(['customerDetails']).value,
    };
  }
}
