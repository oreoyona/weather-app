# WeatherApp
<div style="display: flex; justify-content: center; align-items: center;">
  <img src="project-img.png" alt="My Image" width="auto" height="200" />
  <img src="mobile.png" alt="My Image" width="auto" height="200" />
</div>
This is a simple weather application built using Angular that fetches real-time weather data from a weather API and displays it to the user.

**Key Features:**

* **User-friendly interface:** Clean and intuitive design for easy navigation.
* **Real-time weather data:** Fetches current weather information including temperature, humidity, wind speed, and weather conditions.
* **Adaptative theming** The theme of the app changes according to the weather.

**Technologies Used:**

* **Angular:** A powerful JavaScript framework for building dynamic and interactive web applications.
* **OpenWeatherMap API** the weather service provider.
* **Unsplash API** the image service provider.
* **RxJS**: The application utilizes RxJS (Reactive Extensions for JavaScript) for handling asynchronous data, such as the Observable and Subscription types.

* **HTTP Client**: The application uses the HttpClient module from Angular to make HTTP requests to the weather API.

* **CSV Data Parsing**: The service includes functionality to parse a CSV file containing city data.

* **Color Manipulation**: The isColorDark() method shows my ability to perform color-related calculations and determinations, which can be useful for developing visually appealing user interfaces.

* **Caching and Optimization**: The service includes optimizations such as caching the CSV data and using efficient RxJS operators.

* **Error Handling**: The service includes robust error handling, with the use of a BehaviorSubject to manage and communicate errors, providing a reliable and user-friendly experience.

**How to Run the App:**

1. **Clone the repository:**
   ```bash
   git clone <repository_url>
2. **Install the dependecies**
    ```bash 
    cd weather-app
    npm install
3. **Start the developpment**
    ```bash
    ng serve

