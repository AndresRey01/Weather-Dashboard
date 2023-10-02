const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-btn");

const apiKey = "b765049666d1e9b0de15223c7da397f8";  // API key for the OpenWeatherMap API

const createWeatherCard = (weatherItem) => {
    return `<li class="card">
                <h2>(10-1-2023)</h2>
                <img src="https://openweathermap.org/img/wn/10d@2x.png" alt="weather-icon">
                <h4>Temp: 70°F</h4>
                <h4>Wind: 5 M/S</h4>
                <h4>Humidity: 67%</h4>
            </li>`;
}

const getWeatherDetails = (cityName, lat, lon) => {
    const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    fetch(WEATHER_API_URL).then(res => res.json()).then(data => {
        // Filter the forecasts to get only one forecast per day
        const uniqueForecastDays = [];
        const fiveDaysForecast = data.list.filter(forecast => {
            const forecastDate = new Date(forecast.dt_txt).getDate();
            if(uniqueForecastDays.includes(forecastDate)) {
                return uniqueForecastDays.push(forecastDate);
            }
        })

        console.log(fiveDaysForecast);
        fiveDaysForecast.forEach(weatherItem => {
            createWeatherCard(weatherItem);
        })
    }).catch(() => {
        alert("An error occurred while fetching the weather forecast!")
    });
}

const getCityCoordinates = () => {
    const cityName = cityInput.value.trim(); // Get user entered city name and remove extra spaces
    if(!cityName) return; // Return if cityName is empty
    const GEOCODING_API_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`

    // Get entered city coordinates (latitude, longitude, and name) from the API response
    fetch(GEOCODING_API_URL).then(res => res.json()).then(data => {
        if(data.lenght) return alert(`No coordinates found for ${cityName}`);
        const { name, lat, lon } = data[0]
        getWeatherDetails(name, lat, lon);
    }).catch(() => {
        alert("An error occurred while fetching the coordinates!")
    });
}

searchButton.addEventListener("click", getCityCoordinates)