import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder as FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { CustomerDetails } from './customer-details.model';
import { CustomerDetailsService } from './customer-details.service';
import { User } from '../../../services/user/user.model';
import { UserService } from '../../../services/user/user.service';

@Component({
  selector: 'page-customer-details-update',
  templateUrl: 'customer-details-update.html',
})
export class CustomerDetailsUpdatePage implements OnInit {
  customerDetails: CustomerDetails;
  users: User[];
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [null, []],
    gender: [null, [Validators.required]],
    phone: [null, [Validators.required]],
    addressLine1: [null, [Validators.required]],
    addressLine2: [null, []],
    city: [null, [Validators.required]],
    country: [null, [Validators.required]],
    user: [null, [Validators.required]],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    protected formBuilder: FormBuilder,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private userService: UserService,
    private customerDetailsService: CustomerDetailsService
  ) {
    // Watch the form for changes, and
    this.form.valueChanges.subscribe(v => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ngOnInit() {
    this.userService.findAll().subscribe(
      data => (this.users = data),
      error => this.onError(error)
    );
    this.activatedRoute.data.subscribe(response => {
      this.customerDetails = response.data;
      this.isNew = this.customerDetails.id === null || this.customerDetails.id === undefined;
      this.updateForm(this.customerDetails);
    });
  }

  updateForm(customerDetails: CustomerDetails) {
    this.form.patchValue({
      id: customerDetails.id,
      gender: customerDetails.gender,
      phone: customerDetails.phone,
      addressLine1: customerDetails.addressLine1,
      addressLine2: customerDetails.addressLine2,
      city: customerDetails.city,
      country: customerDetails.country,
      user: customerDetails.user,
    });
  }

  save() {
    this.isSaving = true;
    const customerDetails = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.customerDetailsService.update(customerDetails));
    } else {
      this.subscribeToSaveResponse(this.customerDetailsService.create(customerDetails));
    }
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `CustomerDetails ${action} successfully.`, duration: 2000, position: 'middle' });
    await toast.present();
    await this.navController.navigateBack('/tabs/entities/customer-details');
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

  compareUser(first: User, second: User): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackUserById(index: number, item: User) {
    return item.id;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<CustomerDetails>>) {
    result.subscribe(
      (res: HttpResponse<CustomerDetails>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  private createFromForm(): CustomerDetails {
    return {
      ...new CustomerDetails(),
      id: this.form.get(['id']).value,
      gender: this.form.get(['gender']).value,
      phone: this.form.get(['phone']).value,
      addressLine1: this.form.get(['addressLine1']).value,
      addressLine2: this.form.get(['addressLine2']).value,
      city: this.form.get(['city']).value,
      country: this.form.get(['country']).value,
      user: this.form.get(['user']).value,
    };
  }
}
