//let's first define the interfaces we will need in our app
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

export interface CityData {
  city: string;
  city_ascii: string;
  lat: number;
  lng: number;
  country: string;
  iso2: string;
  iso3: string;
  admin_name: string;
  capital: string;
  population: number;
  id: number;
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


export interface City {
    name: string;
  }
  
export interface CityGroup {
    letter: string;
    names: City[];
  }