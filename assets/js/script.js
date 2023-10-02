const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-btn");
const currentWeather = document.querySelector(".current-weather");
const weatherCards = document.querySelector(".weather-cards");
const searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
const searchHistoryContainer = document.querySelector(".search-history");

const apiKey = "b765049666d1e9b0de15223c7da397f8";  // API key for the OpenWeatherMap API

const createWeatherCard = (cityName, weatherItem, index) => {
    if(index === 0) { // HTML for the main weather card
        return `<div class="details">
                    <h2>${cityName} (${weatherItem.dt_txt.split(" ")[0]})</h2>
                    <h4>Temperature: ${(weatherItem.main.temp - 273.15).toFixed(2)}°F</h4>
                    <h4>Wind: ${weatherItem.wind.speed} M/S</h4>
                    <h4>Humidity: ${weatherItem.main.humidity}%</h4>
                </div>
                <div class="icon">
                <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather-icon">
                    <h4>${weatherItem.weather[0].description}</h4>
                </div>`;
    } else { // HTML for the five day forecast card
        return `<li class="card">
                <h3>(${weatherItem.dt_txt.split(" ")[0]})</h3>
                <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather-icon">
                <h4>Temp: ${(weatherItem.main.temp - 273.15).toFixed(2)}°F</h4>
                <h4>Wind: ${weatherItem.wind.speed} M/S</h4>
                <h4>Humidity: ${weatherItem.main.humidity}%</h4>
            </li>`;
        }

    }
const getWeatherDetails = (cityName, lat, lon) => {
    const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    fetch(weatherUrl).then(res => res.json()).then(data => {
        // Filter the forecasts to get only one forecast per day
        const uniqueForecastDays = [];
        const fiveDaysForecast = data.list.filter(forecast => {
            const forecastDate = new Date(forecast.dt_txt).getDate();
            if(!uniqueForecastDays.includes(forecastDate)) {
            return uniqueForecastDays.push(forecastDate);
            }
        });

        // Clears previous weather data
        cityInput.value = "";
        currentWeather.innerHTML = "";
        weatherCards.innerHTML = "";

        // Creating weather cards and adding them to the DOM
        fiveDaysForecast.forEach((weatherItem, index) => {
            if(index === 0) {
                currentWeather.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatherItem, index));
            } else {
                weatherCards.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatherItem, index));
            }
        });
    }).catch(() => {
        alert("An error occurred while fetching the weather forecast!")
    });
}

const getCityCoordinates = () => {
    const cityName = cityInput.value.trim(); // Get user entered city name and remove extra spaces
    if (!cityName) return; // Return if cityName is empty
    const apiURL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`;

    // Get entered city coordinates (latitude, longitude, and name) from the API response
    fetch(apiURL)
        .then((res) => res.json())
        .then((data) => {
            if (!data.length) return alert(`No coordinates found for ${cityName}`);
            const { lat, lon, name } = data[0];

            // Update the search history with the new city name
            searchHistory.push(name);
            // Save the updated search history to localStorage
            localStorage.setItem("searchHistory", JSON.stringify(searchHistory));

            getWeatherDetails(name, lat, lon);

            // Adds a search history button
            addSearchHistoryButton(name);
        })
        .catch(() => {
            alert("An error occurred while fetching the coordinates!");
        });
};

const displaySearchHistory = () => {
    const historyList = document.querySelector(".search-history");
    historyList.innerHTML = "";

    searchHistory.forEach((city) => {
        const listItem = document.createElement("li");
        listItem.textContent = city;
        listItem.addEventListener("click", () => {
            cityInput.value = city;
            getCityCoordinates();
        });

        historyList.appendChild(listItem);
    });
};

const addSearchHistoryButton = (cityName) => {
    const button = document.createElement("button");
    button.textContent = cityName;
    button.classList.add("search-history-btn");
    button.addEventListener("click", () => {
        cityInput.value = cityName;
        getCityCoordinates();
    });
    searchHistoryContainer.appendChild(button);
};

searchButton.addEventListener("click", getCityCoordinates);
displaySearchHistory();