import { Component, OnInit } from '@angular/core';
import { CustomerDetails } from './customer-details.model';
import { CustomerDetailsService } from './customer-details.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-customer-details-detail',
  templateUrl: 'customer-details-detail.html',
})
export class CustomerDetailsDetailPage implements OnInit {
  customerDetails: CustomerDetails = {};

  constructor(
    private navController: NavController,
    private customerDetailsService: CustomerDetailsService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(response => {
      this.customerDetails = response.data;
    });
  }

  open(item: CustomerDetails) {
    this.navController.navigateForward('/tabs/entities/customer-details/' + item.id + '/edit');
  }

  async deleteModal(item: CustomerDetails) {
    const alert = await this.alertController.create({
      header: 'Confirm the deletion?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Delete',
          handler: () => {
            this.customerDetailsService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/customer-details');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
