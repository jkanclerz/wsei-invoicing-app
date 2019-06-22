import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { InvoiceItem, Unit, Tax } from '../model/item';
import { PriceCalculator } from '../model/price-calculation/price-calculator';
import { Subject } from 'rxjs';
import { ProductCatalog, Product } from '../model/product-catalog/product-catalog';
import {map, filter, debounceTime, retry, tap, switchMap} from 'rxjs/operators';

interface Suggestion {
  label: string;
}

@Component({
  selector: 'app-single-position',
  templateUrl: './single-position.component.html',
  styleUrls: ['./single-position.component.scss']
})
export class SinglePositionComponent implements OnInit {
  @Input()
  private position: InvoiceItem;
  @Input()
  private lp: number;

  private availableUnits: Unit[] = [
    Unit.good,
    Unit.hour,
    Unit.service
  ];
  private availableTaxes: Tax[] = [
    Tax.t23,
    Tax.t8,
    Tax.t5
  ];

  @Output()
  private itemRemoved: EventEmitter<InvoiceItem> = new EventEmitter<InvoiceItem>();

  searchQuery: Subject<string> = new Subject();
  suggestions: Suggestion[];
  showSuggestions: boolean = false;

  searcvhResults = this.searchQuery.pipe(
    filter(q => q.length >= 3),
    tap(q => this.handleSuggestionPreview(q)),
    debounceTime(1000),
    switchMap(query => this.productCatalog.getAllMatchingItems(query)),
    map(products => this.transformProductsToSuggestions(products)),
    tap(suggestions => console.log(suggestions)),
    retry(3)
  )
  .subscribe(results => {
    this.suggestions = results;
  })

  constructor(private priceCalculator: PriceCalculator, private productCatalog: ProductCatalog) {
  }

  transformProductsToSuggestions(products: Product[]): Suggestion[] {
    return products.map(p => {
        return {
          label: p.title
        }
    });
  }

  handleAutoSuggestions($event: any): void 
  {
      this.searchQuery.next($event.target.value);
  }

  ngOnInit() {
    this.position = {
      ...this.position,
      tax: Tax.t23
    };
  }
  mapToSuggestions(q: string): Suggestion[] {
    if (Math.random() <= 0.5) {
      throw new Error('sth is not yes');
    }
    return [
      {label: `${q}_1`},
      {label: `${q}_2`},
      {label: `${q}_3`},
    ];
  }
  removePosition(): void {
    this.itemRemoved.next(this.position);
  }

  handleNettoChanged(): void {
    const calcRequest = {
      netto: this.position.netto,
      gross: null,
      tax: Number(this.position.tax)
    };

    const res = this.priceCalculator.calculate(calcRequest);

    this.position = {
      ...this.position,
      brutto: res.gross
    };
  }

  handleBruttoChanged(): void {
    const calcRequest = {
      netto:  null,
      gross: this.position.brutto,
      tax: Number(this.position.tax)
    };

    const res = this.priceCalculator.calculate(calcRequest);

    this.position = {
      ...this.position,
      netto: res.net
    };
  }

  handleTaxChanged(): void {
    const calcRequest = {
      netto:  this.position.netto,
      gross: this.position.brutto,
      tax: Number(this.position.tax)
    };

    const res = this.priceCalculator.calculate(calcRequest);

    this.position = {
      ...this.position,
      netto: res.net,
      brutto: res.gross,
    };
  }
  handleSuggestionPreview(q: string): void {
    if (q.length <= 3) {
      this.showSuggestions = false;
    } else {
      this.showSuggestions = true;
    }
  }
}
