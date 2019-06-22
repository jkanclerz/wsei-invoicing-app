import {HttpClient} from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

export interface Product {
    title: string;
    description: string;
    keywords?: string[];
}

export abstract class ProductCatalog {
    abstract getAllMatchingItems(query: string): Observable<Product[]>;
}

export class LocalStorageProductCatalog extends ProductCatalog {
    getAllMatchingItems(query: string): Observable<Product[]> 
    {
        return of([]);
    }
}

export class DummyItemCatalog extends ProductCatalog {
    getAllMatchingItems(query: string): Observable<Product[]> 
    {
        return of([
            {title: `${query}_item_1`, description: ''},
            {title: `${query}_item_2`, description: ''},
            {title: `${query}_item_3`, description: ''},
        ]);
    }
}
