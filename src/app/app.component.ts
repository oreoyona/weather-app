import { Component, ElementRef, inject, model, OnInit, signal, ViewChild } from '@angular/core';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { GeolocationService } from './geolocation.service';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { SearchComponent } from './search/search.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { api } from './keys';
import { MatInputModule } from '@angular/material/input';
import { meteoData } from './interfaces';
import { capitalizeFirstLetter } from './helpers';
import {MatCardModule} from '@angular/material/card';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    MatIconModule, 
    MatButtonModule, 
    CommonModule, 
    MatDialogModule, 
    FormsModule, 
    MatFormFieldModule, 
    MatInputModule,
  MatCardModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  //theming
  isDark = true;

  @ViewChild('container') container!: ElementRef;

  //class members and their default values
  meteo!: meteoData;
  title = 'weather-app';
  background = "background.webp"
  curvedSvg = "curved.svg";
  globe = "/assets/globeD.png"
  actualCity = "Brooklyn, New York, USA";
  date = new Date();
  meteoDescription = "Stormy with partly  cloudly";
  long = "";
  lat = "";
  temp = 18;
  max = 20;
  min = 15;
  humidity = 23;
  recentlyViewedCities: any[] = [];

  //weather by search. Let's define the class members
  readonly name = model('');
  readonly city = signal('');

  //inject the MatDialog class into a read-only class member of the component
  readonly dialog = inject(MatDialog);


  //define the function to open the dialog once the user clicks on the search icon

  openDialog(): void {
    const dialogRef = this.dialog.open(SearchComponent, {
      data: { name: this.name(), city: this.city() },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {

        this.city.set(result);
        result = capitalizeFirstLetter(result);
        this.lookupCity(result);
        
        this.recentlyViewedCities.push(result);
      }
    });


  }


  constructor(private geolocationService: GeolocationService, private http: HttpClient) {

  }

  ngOnInit(): void {
    this.getGeoLocation();

  }


  //geolocation service

  getGeoLocation() {
    this.geolocationService.getCurrentPosition().subscribe({
      next: (position) => {
        this.lat = position.coords.latitude;
        this.long = position.coords.longitude;
        let data = this.getMeteo(this.lat, this.long)
      },
      error: (error) => {
        console.log("Error. You can't use this app without enabling geolocation. Please retry ")
      }
    })
  }


  getMeteo(lat: any, long: any) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${api}&units=metric`;

    this.http.get(url).subscribe((data: any) => {
      const meteo: meteoData = {
        town: data.name,
        temp: data.main.temp,
        max: data.main.temp_max,
        min: data.main.temp_min,
        description: data.weather[0].description,
        weaterIconString: data.weather[0].icon,
        weatherState: data.weather[0].main,
        humidity: data.main.humidity
      }

      this.meteo = meteo;
      this.actualCity = this.meteo.town;
      this.meteoDescription = this.meteo.description!;
      this.temp = this.meteo.temp;
      this.max = this.meteo.max;
      this.min = this.meteo.min;
      this.humidity = this.meteo.humidity!;

      this.geolocationService.getPhotos(this.meteoDescription).subscribe((value: any) => {
        const imageUrl = value.results[0].urls.full;
        let imageMainColor = value.results[0].color;
        this.isDark = this.geolocationService.isColorDark(imageMainColor);

        this.container.nativeElement.style.backgroundImage = `url(${imageUrl})`;
      })
    })

  }

  lookupCity(cityName: string) {
    this.geolocationService.getLatLngForCity(cityName).subscribe((data) => {
      const lat = data.lat;
      const long = data.lng;
      this.getMeteo(lat, long);
    });
  }


}
