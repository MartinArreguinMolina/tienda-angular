import { Component, inject, signal } from '@angular/core';
import { AuthService } from '@auth/services/auth-service';
import { ProductTableComponent } from "../../../producs/components/product-table/product-table.component";
import { ProductsService } from 'src/app/producs/services/products.service';
import { PaginationService } from '@shared/components/pagination/pagination.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-products-admin-page',
  imports: [ProductTableComponent, PaginationComponent, RouterLink],
  templateUrl: './products-admin-page.component.html',
  styleUrl: './products-admin-page.component.css',
})
export class ProductsAdminPageComponent {
  productsService = inject(ProductsService);
  paginationService = inject(PaginationService)
  productsPerPage = signal(10);

  productsResource = rxResource({
    request: () => ({
      page: this.paginationService.currentPage() - 1,
      limit: this.productsPerPage()
    }),
    loader: ({request}) => {
      return this.productsService.getProducts({
        offset: request.page,
        limit: request.limit
      });
    }
  });
}
