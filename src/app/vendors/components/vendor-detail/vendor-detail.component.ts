import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { switchMap, takeUntil } from 'rxjs/operators';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { DiscountsService } from '../../../services/discounts.service';
import { forkJoin, Subject } from 'rxjs';
import { Discount, Town, Vendor } from '../../../models';
import { SORT_BY } from '../../../../constants';
import { TicketService } from '../../../services/ticket.service';
import { RefDirective } from '../../../directives/ref.directive';
import { UserService } from '../../../services/user.service';
import { VendorsService } from '../../../services/vendors.service';

@Component({
  selector: 'app-vendor-detail',
  templateUrl: './vendor-detail.component.html',
  styleUrls: ['./vendor-detail.component.scss']
})
export class VendorDetailComponent implements OnInit, OnDestroy {
  sortBy = SORT_BY;
  towns: Town[];
  vendor: Vendor;
  vendorSocials;
  selectedVendorId;
  vendorDiscounts: Discount[];
  activeCoords = {
    longitude: this.userService.activeUserValue.longitude,
    latitude: this.userService.activeUserValue.latitude,
  };
  vendorsList: Vendor[];
  reqOpt = {
    skip: 0,
    take: 10,
    longitude: this.userService.activeUserValue.officeLongitude,
    latitude: this.userService.activeUserValue.officeLatitude,
    sortBy: 'DistanceAsc',
  };
  private unsubscribe$ = new Subject<void>();


  @ViewChild(RefDirective, {static: false}) refDir: RefDirective;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private discountsService: DiscountsService,
    private vendorsService: VendorsService,
    private ticketService: TicketService,
    private userService: UserService,
  ) {
  }

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap((params: ParamMap): any => {
          const vendId: number = +params.get('id');
          return forkJoin(
            this.vendorsService.getVendorById(vendId),
            this.vendorsService.getVendors(),
            this.discountsService.getTowns(),
            this.vendorsService.getVendorsDiscounts(vendId, this.reqOpt)
          );
        }),
        takeUntil(this.unsubscribe$)
      ).subscribe(([vendor, vendors, towns, vendDisc]) => {
      if (!vendor) {
        return;
      }
      this.vendor = vendor;
      const json = JSON.parse(this.vendor.socialLinks);
      this.vendorSocials = Object.keys(json).map(key => ({name: key, path: json[key]}));
      this.selectedVendorId = vendor.vendorId;
      this.vendorsList = vendors;
      this.towns = towns;
      this.vendorDiscounts = vendDisc;
    });
  }

  selectVendor(value: any): void {
    if (!value) {
      return;
    }
    forkJoin(
      this.vendorsService.getVendorById(value),
      this.vendorsService.getVendorsDiscounts(value, this.reqOpt)
    )
      .pipe(
        takeUntil(this.unsubscribe$),
      )
      .subscribe(([vendor, discounts]) => {
        this.vendorDiscounts = discounts;
        this.vendor = vendor;
        console.log('current', this.vendor);
      });
  }

  changeCoords(): void {
    this.userService.getLocation()
      .then(res => {
        this.reqOpt.latitude = res.latitude;
        this.reqOpt.longitude = res.longitude;
      }).then(res => {
      this.vendorsService.getVendorsDiscounts(this.vendor.vendorId, this.reqOpt).pipe(
        takeUntil(this.unsubscribe$)
      )
        .subscribe(data => this.vendorDiscounts = data);
    });
  }

  changeFavourites(discountId: any): void {
    this.discountsService.updateIsSavedDiscount(discountId).pipe(
      takeUntil(this.unsubscribe$)
    )
      .subscribe(resp => {
        this.vendorDiscounts = this.vendorDiscounts.map((discount: Discount) => {
          return discount.discountId === resp.discountID
            ? {...discount, isSaved: resp.isSaved}
            : {...discount};
        });
      });
  }

  onSortChange({value: {sortBy}}): void {
    this.reqOpt.sortBy = sortBy;
    this.vendorsService.getVendorsDiscounts(this.vendor.vendorId, this.reqOpt).pipe(
      takeUntil(this.unsubscribe$)
    )
      .subscribe(res => this.vendorDiscounts = res);
  }

  getTicket(discountId: number): void {
    this.ticketService.getTicket(discountId, this.refDir);
  }

  onLocationChange({value: {latitude, longitude}}): void {
    this.reqOpt.latitude = latitude;
    this.reqOpt.longitude = longitude;
    this.vendorsService.getVendorsDiscounts(this.vendor.vendorId, this.reqOpt).pipe(
      takeUntil(this.unsubscribe$)
    )
      .subscribe(res => this.vendorDiscounts = res);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
