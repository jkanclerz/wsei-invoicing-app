import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InvoicePositionsComponent } from './invoice-positions/invoice-positions.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { SinglePositionComponent } from './single-position/single-position.component';
import { PriceCalculator } from './model/price-calculation/price-calculator';
import { ProductCatalog, DummyItemCatalog, GoogleApiProductCatalog } from './model/product-catalog/product-catalog';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [InvoicePositionsComponent, InvoiceComponent, SinglePositionComponent],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    {provide: PriceCalculator, useFactory: () => new PriceCalculator()},
    {
      provide: ProductCatalog,
      useFactory: (http: HttpClient) => new GoogleApiProductCatalog(http),
      deps: [HttpClient]
    }
  ],
  exports: [InvoiceComponent]
})
export class InvoicingModule { }
