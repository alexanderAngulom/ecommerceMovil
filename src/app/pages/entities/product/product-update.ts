import { Component, OnInit } from '@angular/core';
import { JhiDataUtils } from '../../../services/utils/data-util.service';
import { Capacitor } from '@capacitor/core';
import { Camera, ImageOptions, CameraResultType } from '@capacitor/camera';
import { UntypedFormBuilder as FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController, AlertController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Product } from './product.model';
import { ProductService } from './product.service';
import { ProductCategory, ProductCategoryService } from '../product-category';

@Component({
  selector: 'page-product-update',
  templateUrl: 'product-update.html',
})
export class ProductUpdatePage implements OnInit {
  product: Product;
  productCategories: ProductCategory[];
  imageOptions: ImageOptions;
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [null, []],
    name: [null, [Validators.required]],
    description: [null, []],
    price: [null, [Validators.required]],
    productSize: [null, [Validators.required]],
    image: [null, []],
    imageContentType: [null, []],
    productCategory: [null, [Validators.required]],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    protected formBuilder: FormBuilder,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private dataUtils: JhiDataUtils,

    private alertController: AlertController,
    private productCategoryService: ProductCategoryService,
    private productService: ProductService
  ) {
    // Watch the form for changes, and
    this.form.valueChanges.subscribe(v => {
      this.isReadyToSave = this.form.valid;
    });

    // Set the Camera options
    this.imageOptions = {
      quality: 100,
      width: 900,
      height: 600,
      resultType: CameraResultType.DataUrl,
      allowEditing: true,
    };
  }

  ngOnInit() {
    this.productCategoryService.query().subscribe(
      data => {
        this.productCategories = data.body;
      },
      error => this.onError(error)
    );
    this.activatedRoute.data.subscribe(response => {
      this.product = response.data;
      this.isNew = this.product.id === null || this.product.id === undefined;
      this.updateForm(this.product);
    });
  }

  updateForm(product: Product) {
    this.form.patchValue({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      productSize: product.productSize,
      image: product.image,
      imageContentType: product.imageContentType,
      productCategory: product.productCategory,
    });
  }

  save() {
    this.isSaving = true;
    const product = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.productService.update(product));
    } else {
      this.subscribeToSaveResponse(this.productService.create(product));
    }
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `Product ${action} successfully.`, duration: 2000, position: 'middle' });
    await toast.present();
    await this.navController.navigateBack('/tabs/entities/product');
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

  byteSize(field) {
    return this.dataUtils.byteSize(field);
  }

  async getPicture(fieldName) {
    if (Capacitor.isPluginAvailable('Camera')) {
      try {
        if (Capacitor.isNativePlatform()) {
          const permissions = await Camera.requestPermissions({ permissions: ['camera', 'photos'] });
          if ([permissions.camera, permissions.photos].every(permission => permission === 'denied')) {
            const alert = await this.alertController.create({
              header: "You don't have permission",
              buttons: [{ text: 'Ok' }],
            });
            return alert.present();
          }
        }
        const image = await Camera.getPhoto(this.imageOptions);
        const [meta, imageData] = image.dataUrl.split(',', 2);
        // data:contentType,base64
        const contentType = meta.split(':')[1].split(';')[0].trim();

        const patchValue = { [fieldName]: imageData, [fieldName + 'ContentType']: contentType };
        Object.assign(this.attachment, patchValue);
        this.form.patchValue(patchValue);
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log('Camera plugin not supported');
    }
  }

  clearInputImage(field: string) {
    const patchValue = { [field]: null, [field + 'ContentType']: null };
    Object.assign(this.product, patchValue);
    this.form.patchValue(patchValue);
  }
  setFileData(event, field, isImage) {
    this.dataUtils.loadFileToForm(event, this.form, field, isImage).subscribe();
  }

  compareProductCategory(first: ProductCategory, second: ProductCategory): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackProductCategoryById(index: number, item: ProductCategory) {
    return item.id;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Product>>) {
    result.subscribe(
      (res: HttpResponse<Product>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  private createFromForm(): Product {
    return {
      ...new Product(),
      id: this.form.get(['id']).value,
      name: this.form.get(['name']).value,
      description: this.form.get(['description']).value,
      price: this.form.get(['price']).value,
      productSize: this.form.get(['productSize']).value,
      image: this.form.get(['image']).value,
      imageContentType: this.form.get(['imageContentType']).value,
      productCategory: this.form.get(['productCategory']).value,
    };
  }
}
