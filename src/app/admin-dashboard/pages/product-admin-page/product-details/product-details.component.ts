import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductCarouselComponent } from 'src/app/producs/components/product-carousel/product-carousel.component';
import { Product } from 'src/app/producs/interfaces/product.interface';
import { FormUtils } from 'src/app/utils/form-utils';
import { FormsErrorLabelComponent } from "../../../../shared/components/forms-error-label/forms-error-label.component";
import { ProductsService } from 'src/app/producs/services/products.service';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-product-details',
  imports: [ProductCarouselComponent, ReactiveFormsModule, FormsErrorLabelComponent],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css',
})
export class ProductDetailsComponent implements OnInit{
  product = input.required<Product>();
  fb = inject(FormBuilder);
  productService = inject(ProductsService);
  router = inject(Router);


  wasSafe = signal(false);
  tempImages = signal<string[]>([])
  imageFileList: FileList | undefined = undefined;

  imagesToCarousel = computed(() => {
    const currentImages = [
      ... this.product().images,
      ... this.tempImages(),
    ]


    return currentImages;
  })

  productForm = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    slug: ['', [Validators.required, Validators.pattern(FormUtils.slugPattern)]],
    price: [0, [Validators.required, Validators.min(0)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    sizes: [['']],
    images: [[]],
    gender: ['men', [Validators.required, Validators.pattern(/men|women|kid|unisex/)]],
    tags: ['']
  })


  sizes = ['XS','S','M','L','XL','XXL'];


  async onSubmit(){
    const isValid = this.productForm.valid;
    this.productForm.markAllAsTouched();

    if(!isValid) return;
    const formValue = this.productForm.value;

    // ESTO HACE QUE TODO PUEDA SER NO REQUERIDO
    const productLike: Partial<Product> = {
      ...(formValue as any),
      tags:
        formValue.tags
        ?.toLowerCase()
        .split(',')
        .map((tag) => tag.trim()) ?? []
    }

    if(this.product().id === 'new'){
      //Automaticamente realiza la subscripcion
      const product = await firstValueFrom(this.productService.crateProduct(productLike, this.imageFileList))
      console.log('Producto creado');
      this.router.navigate(['/admin/products', product.id]);

    }else{
      await firstValueFrom(this.productService.updateProduct(this.product().id, productLike, this.imageFileList))
    }

    this.wasSafe.set(true);
    setTimeout(() => {
      this.wasSafe.set(false);
    }, 3000)

  }

  onFilesChanged(event: Event){
    const filesList = (event.target as HTMLInputElement).files;
    this.imageFileList = filesList ?? undefined;
    const imageUrl = Array.from(filesList ?? []).map(file => URL.createObjectURL(file))
    this.tempImages.set(imageUrl)
  }


  setFormValue(formLike: Partial<Product>){
    this.productForm.reset(this.product() as any)
    this.productForm.patchValue({tags: formLike.tags?.join(',')})
  }

  ngOnInit(): void {
    this.setFormValue(this.product())
  }


  onSizeClicked(size: string){
    const currentSizes = this.productForm.value.sizes ?? [];

    if(currentSizes.includes(size)){
      currentSizes.slice(currentSizes.indexOf(size), 1)
    }else{
      currentSizes.push(size);
    }

    this.productForm.patchValue({sizes: currentSizes})
  }
 }
