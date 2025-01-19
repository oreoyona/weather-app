import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, of} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CityData } from './interfaces';
import { unsplashAccessKey } from './keys';

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {
  private csvUrl = '/assets/worldcities.csv';
  private http = inject(HttpClient);
  private errorSubject = new BehaviorSubject<string | null>(null);
  private cityData: CityData[] | null = null;

  get errorMessage$(): Observable<string | null> {
    return this.errorSubject.asObservable();
  }

  getPhotos(motCle: string): Observable<any> {
    const url = `https://api.unsplash.com/search/photos?query=${motCle}&client_id=${unsplashAccessKey}`;
    return this.http.get(url);
  }

  getCurrentPosition(): Observable<any> {
    return new Observable((observer) => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            observer.next(position);
            observer.complete();
          },
          (error) => {
            this.errorSubject.next(error.message);
            observer.error(error);
          }
        );
      } else {
        this.errorSubject.next('Geolocation is not available in this browser.');
        observer.error('Geolocation is not available in this browser.');
      }
    });
  }

  isColorDark(hexColor: string): boolean {
    hexColor = hexColor.replace('#', '');
    const r = parseInt(hexColor.substring(0, 2), 16);
    const g = parseInt(hexColor.substring(2, 4), 16);
    const b = parseInt(hexColor.substring(4, 6), 16);
    const luminosity = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    const threshold = 0.5;
    return luminosity < threshold;
  }

  getLatLngForCity(cityName: string): Observable<{ lat: number; lng: number }> {
    return this.getCityData().pipe(
      map((data) => data.find((city) => city.city === cityName) || { lat: 0, lng: 0 })
    );
  }

  getCityNames(): Observable<string[]> {
    return this.getCityData().pipe(
      map((data) => Array.from(new Set(data.map((city) => city.city))))
    );
  }

  private getCityData(): Observable<CityData[]> {
    if (this.cityData) {
      return of(this.cityData);
    }

    return this.http.get(this.csvUrl, { responseType: 'text' }).pipe(
      map((response) => {
        const lines = response.trim().split('\n');
        const headers = lines[0].split(',').map((header) => header.replace(/"/g, ''));
        this.cityData = lines.slice(1).map((line) => {
          const values = line.split(',');
          return headers.reduce((obj: any, header, index) => {
            const value = values[index].replace(/"/g, '');
            switch (header) {
              case 'lat':
              case 'lng':
              case 'population':
                obj[header] = parseFloat(value);
                break;
              case 'id':
                obj[header] = parseInt(value, 10);
                break;
              default:
                obj[header] = value;
            }
            return obj;
          }, {} as CityData);
        });
        return this.cityData;
      })
    );
  }
}