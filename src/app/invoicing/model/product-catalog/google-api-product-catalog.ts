import { ProductCatalog, Product } from './product-catalog';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface BooksApiResponse {
    items: Book[];
}
interface VolumeInfo {
    title: string;
    subtitle: string;
}

interface Book {
    volumeInfo: VolumeInfo;
}

export class GoogleApiProductCatalog extends ProductCatalog {
    SEARCH_URL = 'https://www.googleapis.com/books/v1/volumes';

    constructor(private http: HttpClient) {
        super();
    }
    getAllMatchingItems(query: string): Observable<Product[]>
    {
        const url = `${this.SEARCH_URL}?q=${query}`;
        return this.http.get<BooksApiResponse>(url).pipe(
            map(resp => resp.items),
            map(items => this.itemsToProducts(items))
        );
        // https://www.googleapis.com/books/v1/volumes?q=po%C5%BCegnanie%20z%20afryk%C4%85
           //handle all magick with google;
    }

    itemsToProducts(books: Book[]): Product[] {
        return books.map(item => {
            return {
                title: item.volumeInfo.title,
                description: item.volumeInfo.subtitle,
                keywords: []
            }
        })
    }
}