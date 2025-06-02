import { SlicePipe } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { Product } from 'src/app/producs/interfaces/product.interface';
import { ProductImagePipe } from 'src/app/producs/pipes/product-image.pipe';
import { ProductsService } from 'src/app/producs/services/products.service';

@Component({
  selector: 'app-product-card',
  imports: [RouterLink, ProductImagePipe, SlicePipe],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css',
})
export class ProductCardComponent {
  product = input.required<Product>();


  imageUrl = computed(() => {
    return `http://localhost:3000/api/files/product/${this.product().images[0]}`
  })

}
