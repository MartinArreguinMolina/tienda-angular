// import { ProductCardComponent } from '@/store-front/components/product-card/product-card.component';
import { Component, inject, signal } from '@angular/core';
import { ProductCardComponent } from 'src/app/producs/components/product-card/product-card.component';
import { ProductsService } from 'src/app/producs/services/products.service';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { PaginationComponent } from "../../../shared/components/pagination/pagination.component";
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { PaginationService } from '@shared/components/pagination/pagination.service';
// import { ProductCardComponent } from "../../components/product-card/product-card.component";

@Component({
  selector: 'app-home-page',
  imports: [ProductCardComponent, PaginationComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
})
export class HomePageComponent {
  productsService = inject(ProductsService);
  paginationService = inject(PaginationService)

  productsResource = rxResource({
    request: () => ({page: this.paginationService.currentPage() - 1}),
    loader: ({request}) => {
      return this.productsService.getProducts({
        offset: request.page
      });
    }
  });
 }
