const apiKey = "482944e26d320a80bd5e4f23b3de7d1f"; 
const cities = ["Rio de Janeiro", "Beijing", "Los Angeles"];
const defaultCityData = {};

function fetchWeather(city) {
    if (defaultCityData[city]) {
        updateWeather(defaultCityData[city], city);
        return;
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (cities.includes(city)) {
                defaultCityData[city] = data;
            }
            updateWeather(data, city);
        })
        .catch(error => console.error("Error fetching data: ", error));
}

function defaultWeather() {
    document.getElementById("weather").innerHTML = ""; 
    cities.forEach(city => {
        if (defaultCityData[city]) {
            updateWeather(defaultCityData[city], city); // Use cached data if available
        } else {
            fetchWeather(city);
        }
    });
}

function searchWeather() {
    const cityInput = document.getElementById("cityInput").value;
    if (cities.includes(cityInput)) {
        // If the city is one of the predefined ones, just update the weather
        fetchWeather(cityInput);
    } else {
        // If it's a new city, clear the div and fetch the weather
        document.getElementById("weather").innerHTML = "";
        fetchWeather(cityInput);
    }
}

function updateWeather(data, city) {
    // Find the existing div for the city or create a new one if it doesn't exist
    let cityDiv = document.querySelector(`div[data-city='${city}']`);
    if (!cityDiv) {
        cityDiv = document.createElement('div');
        cityDiv.setAttribute('data-city', city);
        document.getElementById("weather").appendChild(cityDiv);
    }

    // Update the city's weather div with new data
    if (data.cod === "404") {
        cityDiv.innerHTML = `<p>Weather for ${city} not found. Please try another city.</p>`;
        return;
    }
    
    const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
    cityDiv.innerHTML = `
        <h2>${data.name}</h2>
        <img src="${iconUrl}" alt="${data.weather[0].description}">
        <p>Temperature: ${data.main.temp}°C</p>
        <p>Condition: ${data.weather[0].main}</p>
    `;
}

// Fetch and display default cities weather on load
defaultWeather();
