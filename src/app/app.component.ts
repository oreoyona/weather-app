import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { GeolocationService, meteoData, Photo } from './geolocation.service';
import { HttpClient } from '@angular/common/http';

const rainyIcon = ` <svg xmlns="http://www.w3.org/2000/svg" height="67px" viewBox="0 -960 960 960" width="67px" fill="#e8eaed"><path d="M558-84q-15 8-30.5 2.5T504-102l-60-120q-8-15-2.5-30.5T462-276q15-8 30.5-2.5T516-258l60 120q8 15 2.5 30.5T558-84Zm240 0q-15 8-30.5 2.5T744-102l-60-120q-8-15-2.5-30.5T702-276q15-8 30.5-2.5T756-258l60 120q8 15 2.5 30.5T798-84Zm-480 0q-15 8-30.5 2.5T264-102l-60-120q-8-15-2.5-30.5T222-276q15-8 30.5-2.5T276-258l60 120q8 15 2.5 30.5T318-84Zm-18-236q-91 0-155.5-64.5T80-540q0-83 55-145t136-73q32-57 87.5-89.5T480-880q90 0 156.5 57.5T717-679q69 6 116 57t47 122q0 75-52.5 127.5T700-320H300Zm0-80h400q42 0 71-29t29-71q0-42-29-71t-71-29h-60v-40q0-66-47-113t-113-47q-48 0-87.5 26T333-704l-10 24h-25q-57 2-97.5 42.5T160-540q0 58 41 99t99 41Zm180-200Z"/></svg>
`

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  isDark = true;
  @ViewChild('container') container!: ElementRef;
  meteo!: meteoData;
  title = 'weather-app';
  background = "background.jpg"
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

  constructor(private geolocationService: GeolocationService, private http: HttpClient) {
    const iconRegistery = inject(MatIconRegistry);
    const sanitizer = inject(DomSanitizer);
    iconRegistery.addSvgIconLiteral('rainy', sanitizer.bypassSecurityTrustHtml(rainyIcon));
  }

  ngOnInit(): void {
    this.getGeoLocation();

 
  }

  getGeoLocation() {
    this.geolocationService.getCurrentPosition().subscribe({
      next: (position) => {
        this.lat = position.coords.latitude;
        this.long = position.coords.longitude;
        let data = this.getMeteo(this.lat, this.long)
        console.log(data)
      },
      error: (error) => {
        console.log("Error. You can't use this app without enabling geolocation. Please retry ")
      }
    })
  }


  getMeteo(lat: any, long: any) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${this.geolocationService.api}&units=metric`;

    this.http.get(url).subscribe((data: any) => {
      const temp = data.main.temp;
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

      this.geolocationService.getPhotos(this.meteoDescription).subscribe((value: any)=>{
        const imageUrl = value.results[0].urls.full;
        let imageMainColor = value.results[0].color;
        this.isDark = this.geolocationService.isColorDark(imageMainColor);
        
        this.container.nativeElement.style.backgroundImage = `url(${imageUrl})`;
      })
    })

  }

}
