import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { CustomerDetails } from './customer-details.model';
import { CustomerDetailsService } from './customer-details.service';

@Component({
  selector: 'page-customer-details',
  templateUrl: 'customer-details.html',
})
export class CustomerDetailsPage {
  customerDetails: CustomerDetails[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private customerDetailsService: CustomerDetailsService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.customerDetails = [];
  }

  async ionViewWillEnter() {
    await this.loadAll();
  }

  async loadAll(refresher?) {
    this.customerDetailsService
      .query()
      .pipe(
        filter((res: HttpResponse<CustomerDetails[]>) => res.ok),
        map((res: HttpResponse<CustomerDetails[]>) => res.body)
      )
      .subscribe(
        (response: CustomerDetails[]) => {
          this.customerDetails = response;
          if (typeof refresher !== 'undefined') {
            setTimeout(() => {
              refresher.target.complete();
            }, 750);
          }
        },
        async error => {
          console.error(error);
          const toast = await this.toastCtrl.create({ message: 'Failed to load data', duration: 2000, position: 'middle' });
          await toast.present();
        }
      );
  }

  trackId(index: number, item: CustomerDetails) {
    return item.id;
  }

  async new() {
    await this.navController.navigateForward('/tabs/entities/customer-details/new');
  }

  async edit(item: IonItemSliding, customerDetails: CustomerDetails) {
    await this.navController.navigateForward('/tabs/entities/customer-details/' + customerDetails.id + '/edit');
    await item.close();
  }

  async delete(customerDetails) {
    this.customerDetailsService.delete(customerDetails.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'CustomerDetails deleted successfully.', duration: 3000, position: 'middle' });
        await toast.present();
        await this.loadAll();
      },
      error => console.error(error)
    );
  }

  async view(customerDetails: CustomerDetails) {
    await this.navController.navigateForward('/tabs/entities/customer-details/' + customerDetails.id + '/view');
  }
}
