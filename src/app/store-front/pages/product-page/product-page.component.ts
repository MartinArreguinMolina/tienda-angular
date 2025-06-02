import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from 'src/app/producs/services/products.service';
import { ProductCarouselComponent } from "../../../producs/components/product-carousel/product-carousel.component";

@Component({
  selector: 'app-product-page',
  imports: [ProductCarouselComponent],
  templateUrl: './product-page.component.html',
  styleUrl: './product-page.component.css',
})
export class ProductPageComponent {
  productService = inject(ProductsService);
  route = inject(ActivatedRoute);


  productIdSlug = this.route.snapshot.params['idSlug'];


  // Se puede cambiar a una senal para que se dispare
  product = rxResource({
    request: () => ({idSlug: this.productIdSlug}),
    loader: ({request}) => {
      return this.productService.getProductByIdSlug(request.idSlug);
    }
  })
}
