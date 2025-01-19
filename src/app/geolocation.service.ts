import { Injectable, signal } from '@angular/core';
import { map, Observable, Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export interface meteoData {
  town: string,
  temp: number,
  max: number,
  min: number,
  description?: string,
  weatherState?: string,
  weaterIconString?: string,
  humidity?: number
}

// Unsplash API interface
export interface Photo {
  id: number;
  width: number;
  height: number;
  urls: { large: string; regular: string; raw: string; small: string };
  color: string | null;
  user: { username: string; name: string };
}


@Injectable({
  providedIn: 'root'
})
export class GeolocationService {

  api = "317c41248b8b85897ab09909dbd8b173";
  unsplashAccessKey = "K5-hH_TjH1fVgWPCz28Px2em7IuivMqlBfJfibtECpU";

  photos: Photo[] = [];
  errorMessage: string | null = null;
  subscription: Subscription | null = null;
  
  constructor(private http: HttpClient) {

  }

 

  getPhotos(motCle: string) {
    const url = `https://api.unsplash.com/search/photos?query=${motCle}&client_id=g495q1LVhrNwMJyKHAe53qspT0imbuSc7jN3DoT3aus`;
    return this.http.get(url)
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
            observer.error(error);
          }
        )
      }

      else {
        observer.error('Geolocation is not available in this browser.');
      }
    })
  }


  isColorDark(hexColor: string) {
    // Supprimer le symbole '#' si présent
    hexColor = hexColor.replace('#', '');
  
    // Convertir les valeurs hexadécimales en décimales
    const r = parseInt(hexColor.substring(0, 2), 16);
    const g = parseInt(hexColor.substring(2, 4), 16);
    const b = parseInt(hexColor.substring(4, 6), 16);
  
    // Calculer la luminosité relative
    const luminosity = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  
    // Définir un seuil de luminosité (ajustez selon vos besoins)
    const threshold = 0.5;
  
    return luminosity < threshold;
  }
}