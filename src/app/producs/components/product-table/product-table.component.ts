import { Component, input } from '@angular/core';
import { Product } from '../../interfaces/product.interface';
import { ProductImagePipe } from '../../pipes/product-image.pipe';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-product-table',
  imports: [ProductImagePipe, RouterLink, CurrencyPipe],
  templateUrl: './product-table.component.html',
  styleUrl: './product-table.component.css',
})
export class ProductTableComponent {
  products = input.required<Product[]>();
}
