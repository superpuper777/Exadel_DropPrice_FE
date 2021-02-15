import { Injectable } from '@angular/core';
import { ApiDataService } from './api-data.service';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { Vendor } from '../models';


@Injectable({
  providedIn: 'root'
})
export class DiscountsService {
  constructor(
    private restApi: ApiDataService,
  ) {
  }

  getDiscounts({skip, take, longitude, latitude, sortBy}): Observable<any> {
    const options: { params: HttpParams } = {
      params: new HttpParams()
        .set('skip', skip)
        .set('take', take)
        .set('longitude', longitude)
        .set('latitude', latitude)
        .set('sortBy', sortBy)
    };
    return this.restApi.getDiscounts(options);
  }

  getVendors(): Observable<Vendor[]> {
    return this.restApi.getVendors();
  }

  getTowns(): Observable<any> {
    return this.restApi.getTowns();
  }

  getTags(skip, take): Observable<any> {
    const options: { params: HttpParams } = {
      params: new HttpParams()
        .set('skip', skip)
        .set('take', take)
    };
    return this.restApi.getTags(options);
  }

  updateIsSavedDiscount(discountId): Observable<any> {
    return this.restApi.updateIsSavedDiscount(discountId);
  }

  getDiscountById(discountId, params): Observable<any> {
    const paramsObj = {};
    Object.keys({...params}).filter(value => typeof params[value] !== 'undefined').forEach(param => {
      paramsObj[param] = params[param];
    });
    const options: { params: HttpParams } = {
      params: new HttpParams({fromObject: paramsObj})
    };
    return this.restApi.getDiscountById(discountId, options);
  }

  getVendorById(vendorId): Observable<any> {
    return this.restApi.getVendorById(vendorId);
  }

  getVendorsDiscounts(vendorId, params): Observable<any> {
    const paramsObj = {};
    Object.keys({...params}).filter(value => typeof params[value] !== 'undefined').forEach(param => {
      paramsObj[param] = params[param];
    });
    const options: { params: HttpParams } = {
      params: new HttpParams({fromObject: paramsObj})
    };
    return this.restApi.getVendorsDiscounts(vendorId, options);
  }

  searchDiscounts(params): Observable<any> {
    const paramsObj = {};
    Object.keys({...params}).filter(value => typeof params[value] !== 'undefined').forEach(param => {
      paramsObj[param] = params[param];
    });
    const options: { params: HttpParams } = {
      params: new HttpParams({fromObject: paramsObj})
    };
    return this.restApi.searchDiscounts(options);
  }

  putDiscountInArchive(discountId): Observable<any> {
    return this.restApi.putDiscountInArchive(discountId);
  }

  postDiscount(discount): any {
    return this.restApi.postDiscount(discount);
  }

  updateDiscount(id:number):any {
   return this.restApi.updateIsSavedDiscount(id);
  }
}
