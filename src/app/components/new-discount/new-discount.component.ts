import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  ValidationErrors,
} from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { DiscountsService } from '../../services/discounts.service';

import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTooltipModule } from '@angular/material/tooltip';
export interface Tag {
  name: string;
}

@Component({
  selector: 'app-new-discount',
  templateUrl: './new-discount.component.html',
  styleUrls: ['./new-discount.component.scss'],
})
export class NewDiscountComponent implements OnInit {
  newDiscountForm: FormGroup;
  hide = true;
  tagsArray: Tag[] = [];
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  isChecked = true;

  vendors: string[] = [
    'Astra',
    'BacardiGroup',
    'Citrus',
    'DriverPlus',
    'Eshko',
    'Focus',
    'Green',
    'Hudson',
    'SportBet',
    'Sportmaster',
  ];

  filteredVendors: Observable<string[]>;

  @ViewChild('tagInput') tagInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocompleteModule;

  constructor(
    public translateService: TranslateService,
    public fb: FormBuilder,
  ) {}

  ngOnInit(): void {

    this.newDiscountForm = this.fb.group({
      vendorName: ['', [Validators.required, this.requireMatch.bind(this)]],
      discountName: ['', [Validators.required]],
      descriptionDiscount: ['', [Validators.required]],
      discountAmount: ['', [Validators.required, Validators.min(1), Validators.max(100)]],
      promoCode: [''],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      tags: this.fb.array([], Validators.required),
      activityStatus: [true, [Validators.requiredTrue]],
      pointsOfSales: this.fb.array([], Validators.required),
    });

    this.filteredVendors = this.newDiscountForm
      .get('vendorName')
      .valueChanges.pipe(
        startWith(''),
        map((name) => (name ? this._filter(name) : this.vendors.slice()))
      );
  }

  private requireMatch(control: AbstractControl): ValidationErrors | null {
    const selection: any = control.value;
    if (this.vendors && this.vendors.indexOf(selection) < 0) {
      return { requireMatch: true };
    }
    return null;
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.vendors.filter(
      (vendor) => vendor.toLowerCase().indexOf(filterValue) === 0
    );
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      const index = this.tags.value.includes(value);

      if (!index) {
        this.tags.push(new FormControl(value.trim()));
      }
    }

    if (input) {
      input.value = '';
    }
  }

  remove(tag: any): void {
    const index = this.tags.value.indexOf(tag.value);

    if (index >= 0) {
      this.tags.value.splice(index, 1);
    }

    this.tags.controls.forEach((item, index) => {
      if (item.value === tag.value) {
        this.tags.controls.splice(index, 1);
      }
    });
  }

  addPoint() :void {
    this.hide = false;
    const point = this.fb.group({
      name: ['', [Validators.required]],
      address: ['', [Validators.required]],
    });
    this.pointOfSalesForms.push(point);
  }

  deletePoint(i) :void {
    this.pointOfSalesForms.removeAt(i);
  }

  addLocation(i) :void {
    console.log(`ADD location to ${i} object`);
  }

  submit(): void {
    this.newDiscountForm.value;
    console.log('Form Submitted!', this.newDiscountForm.value);
    this.newDiscountForm.reset();

    for (const control in this.newDiscountForm.controls) {
      this.newDiscountForm.controls[control].setErrors(null);
    }

    this.tags.controls = [];
  }

  get vendorName(): AbstractControl {
    return this.newDiscountForm.get('vendorName');
  }

  get discountName(): AbstractControl {
    return this.newDiscountForm.get('discountName');
  }

  get descriptionDiscount(): AbstractControl {
    return this.newDiscountForm.get('descriptionDiscount');
  }

  get discountAmount(): AbstractControl {
    return this.newDiscountForm.get('discountAmount');
  }

  get promoCode(): AbstractControl {
    return this.newDiscountForm.get('promoCode');
  }

  get startDate(): AbstractControl {
    return this.newDiscountForm.get('startDate');
  }

  get endDate(): AbstractControl {
    return this.newDiscountForm.get('endDate');
  }

  get tags(): FormArray {
    return this.newDiscountForm.get('tags') as FormArray;
  }

  get activityStatus(): AbstractControl {
    return this.newDiscountForm.get('activityStatus');
  }

  get name(): AbstractControl {
    return this.pointOfSalesForms.get('name');
  }

  get address(): AbstractControl {
    return this.pointOfSalesForms.get('address');
  }

  get pointOfSalesForms(): FormArray {
    return this.newDiscountForm.get('pointsOfSales') as FormArray;
  }
}
