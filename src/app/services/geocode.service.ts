import { GeocoderResult, GeocoderStatus, MapsAPILoader } from '@agm/core';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { fromPromise } from 'rxjs/internal-compatibility';
import { map, switchMap, tap } from 'rxjs/operators';
import { Location } from '../models/location';


@Injectable({
  providedIn: 'root'
})
export class GeocodeService {
  private geocoder: any;

  constructor(
    private mapLoader: MapsAPILoader
  ) {
  }

  private initGeocoder(): void {
    console.log('Init geocoder!');
    // @ts-ignore
    this.geocoder = new google.maps.Geocoder();
  }

  private waitForMapsToLoad(): Observable<boolean> {
    if (!this.geocoder) {
      return fromPromise(this.mapLoader.load())
        .pipe(
          tap(() => this.initGeocoder()),
          map(() => true)
        );
    }
    return of(true);
  }

  geocodeAddress(location: string): Observable<Location> {
    console.log('Start geocoding!');
    return this.waitForMapsToLoad().pipe(
      // filter(loaded => loaded),
      switchMap((): Observable<any> => {
        return new Observable(observer => {
          this.geocoder.geocode({address: location}, (results, status) => {
            // @ts-ignore
            if (status === google.maps.GeocoderStatus.OK) {
              console.log('Geocoding complete!');
              observer.next(results);
            } else {
              console.log('Error - ', results, ' & Status - ', status);
              observer.next({lat: 0, lng: 0});
            }
            observer.complete();
          });
        });
      })
    );
  }

  geocodeAddressByCoordinates(latitude, longitude): Observable<any> {
    return this.waitForMapsToLoad().pipe(
      switchMap((): Observable<any> => {
        return new Observable<any>(observer => {
          this.geocoder.geocode({
            location: {
              lat: latitude,
              lng: longitude
            }
          }, (results, status) => {
            // @ts-ignore
            if (status === google.maps.GeocoderStatus.OK) {
              console.log('Geocoding complete!');
              observer.next(results);
            } else {
              console.log('Error - ', results, ' & Status - ', status);
              observer.next({lat: 0, lng: 0});
            }
            observer.complete();
          });
        });
      })
    );
  }
}
