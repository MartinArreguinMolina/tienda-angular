import { HttpClient } from '@angular/common/http';
import { inject, Injectable, Pipe } from '@angular/core';
import { Gender, Product, ProductsResponse } from '../interfaces/product.interface';
import { delay, forkJoin, map, Observable, of, switchMap, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '@auth/interface/user.interface';

const baseUrl = environment.baseUrl;


interface Options{
  limit?: number,
  offset?: number,
  gender?: string,
}

const emptyProduct: Product = {
  id: 'new',
  title: '',
  price: 0,
  description: '',
  slug: '',
  stock: 0,
  sizes: [],
  gender: Gender.Kid,
  tags: [],
  images: [],
  user: {} as User
}

@Injectable({providedIn: 'root'})
export class ProductsService {
  private http = inject(HttpClient);

  constructor() { }

  private productsCache = new Map<string, ProductsResponse>;
  private productChache = new Map<string, Product>;

  getProducts(options: Options): Observable<ProductsResponse>{

    const {limit = 9, offset = 0, gender = ''} = options;
    const key = `${limit}-${offset}-${gender}`
    if(this.productsCache.has(key)){
      return of(this.productsCache.get(key)!);
    }


    return this.http.get<ProductsResponse>(`${baseUrl}/products`,{
      params: {
        limit,
        offset,
        gender
      }
    })
    .pipe(
      tap((r) => console.log(r)),
      tap((r) => this.productsCache.set(key, r))
    );
  }

  getProductByIdSlug(idSlug: string):Observable<Product> {
    const key = `${idSlug}`
    if(this.productChache.has(key)){
      return of(this.productChache.get(key)!);
    }
    return this.http.get<Product>(`${baseUrl}/products/${idSlug}`).pipe(
      delay(2000),
      tap((r) => this.productChache.set(key, r))
    )
  }

  getProductById(id: string):Observable<Product> {
    if(id === 'new'){
      return of(emptyProduct);
    }
    const key = `${id}`
    if(this.productChache.has(key)){
      return of(this.productChache.get(key)!);
    }
    return this.http.get<Product>(`${baseUrl}/products/${id}`).pipe(
      delay(2000),
      tap((r) => this.productChache.set(key, r))
    )
  }

  updateProduct(id: string, productLike: Partial<Product>, imageFileList?: FileList): Observable<Product>{
    const currentImages = productLike.images ?? [];

    return this.uploadImages(imageFileList).pipe(
      map(imagesNames => ({
        ...productLike,
        images: [...currentImages, ...imagesNames]
      })),
      //el switchMap nos sirve para trabajar con los observables anteriores previamente modificados
      switchMap((updatedProduct) =>
        this.http.patch<Product>(`${baseUrl}/products/${id}`, updatedProduct)
      ),
      tap((product) => this.updateProductCache(product))
    )

    // return this.http.patch<Product>(`${baseUrl}/products/${id}`, productLike).pipe(
    //   tap((product) => this.updateProductCache(product))
    // )
  }

  crateProduct(productLike: Partial<Product>, imageFileList?: FileList): Observable<Product>{
    return this.http.post<Product>(`${baseUrl}/products`, productLike).pipe(
      tap((product) => this.updateProductCache(product)));
  }


  updateProductCache(product: Product) {
    const productId = product.id;
    this.productChache.set(productId, product);

    this.productsCache.forEach((productResponse) => {
      productResponse.products = productResponse.products.map(
        (currenProduct) => currenProduct.id === productId ? product : currenProduct
      )
    });


    console.log('Cache actualizado')
  }

  // Tome un file list y lo suba
  uploadImages(images? : FileList): Observable<string[]>{
    if(!images) return of([]);

    const uploadObsrvables = Array.from(images).map((imageFile) => this.uploadImage(imageFile));


    //ASI PODEMOS HACER QUE UN CONJUNTO DE OBSERVABLES SE CUMPLAN
    return forkJoin(uploadObsrvables).pipe(
      tap((images) => console.log({images}))
    );

  }

  uploadImage(imageFile: File): Observable<string>{
    const formData = new FormData();
    formData.append('file', imageFile);

    return this.http
      .post<{fileName: string}>(`${baseUrl}/files/product`, formData)
      .pipe(
        map((resp) => resp.fileName)
      )
  }

}
