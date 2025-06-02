import { Routes } from "@angular/router";
import { StoreFrontLayoutsComponent } from "./layouts/store-front-layouts/store-front-layouts.component";
import { HomePageComponent } from "./pages/home-page/home-page.component";
import { GenderPageComponent } from "./pages/gender-page/gender-page.component";
import { ProductPageComponent } from "./pages/product-page/product-page.component";
import { NotFoundComponent } from "./pages/not-found/not-found.component";

export const storeFrontRoutes: Routes = [
  {
    path: '',
    component: StoreFrontLayoutsComponent,
    children: [
      {
        path: '',
        component: HomePageComponent
      },

      {
        path: 'gender/:gender',
        component: GenderPageComponent,
      },

      {
        path: 'product/:idSlug',
        component: ProductPageComponent,
      },

      {
        path: '**',
        component: NotFoundComponent
      }
    ]
  },


  {
    path: '**',
    redirectTo: ''
  }
]


export default storeFrontRoutes;
