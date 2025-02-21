const apiKey1 = 'ERKiWwwk9craOxZg4nODy7K7ps51LF1a';
const apiKey2 = 'GRWCdsnp8Tg5sAGvJJCS5lTI6Cyieogh';
const apiKey3 = 'uwmSyBMGzFZcfo6VG6p90Q8zHgtmc5Pt';
const locationKey = '340850';

// URL for current weather
const currentWeatherUrl = `https://dataservice.accuweather.com/currentconditions/v1/${locationKey}?apikey=${apiKey1}&details=true`;

// URL for forecast
const forecastUrl = `https://dataservice.accuweather.com/forecasts/v1/daily/5day/${locationKey}?apikey=${apiKey3}&details=true&metric=false`;

fetch(currentWeatherUrl)
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        return response.json();
    })
    .then(data => {
        const weatherData = data[0];
        const weatherText = weatherData.WeatherText;
        const temperature = weatherData.Temperature.Imperial.Value;
        const humidity = weatherData.RelativeHumidity;
        const windSpeed = weatherData.Wind.Speed.Imperial.Value;
        const windChillTemperature = weatherData.WindChillTemperature.Imperial.Value;
        const weatherIcon = weatherData.WeatherIcon;

        document.getElementById('weatherIcon').innerHTML = `<img src="https://www.awxcdn.com/adc-assets/images/weathericons/${weatherIcon}.svg" alt="Weather Icon">`;

        document.getElementById('weather').innerHTML = `
            <h3 style="color: black;">${weatherText}</h3>
            <p>Temperature: ${temperature}°F</p>
            <p>Humidity: ${humidity}%</p>
            <p>Wind Speed: ${windSpeed} mph</p>
            <p>Wind Chill: ${windChillTemperature}°F</p>
        `;
    })
    .catch(error => {
        console.error('Error fetching current weather data:', error);
        const secondCurrentWeatherUrl = `https://dataservice.accuweather.com/currentconditions/v1/${locationKey}?apikey=${apiKey2}&details=true`;
        fetch(secondCurrentWeatherUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                return response.json();
            })
            .then(data => {
                const weatherData = data[0];
                const weatherText = weatherData.WeatherText;
                const temperature = weatherData.Temperature.Imperial.Value;
                const humidity = weatherData.RelativeHumidity;
                const windSpeed = weatherData.Wind.Speed.Imperial.Value;
                const windChillTemperature = weatherData.WindChillTemperature.Imperial.Value;
                const weatherIcon = weatherData.WeatherIcon;

                document.getElementById('weatherIcon').innerHTML = `<img src="https://www.awxcdn.com/adc-assets/images/weathericons/${weatherIcon}.svg" alt="Weather Icon">`;

                document.getElementById('weather').innerHTML = `
                    <h3 style="color: black;">${weatherText}</h3>
                    <p>Temperature: ${temperature}°F</p>
                    <p>Humidity: ${humidity}%</p>
                    <p>Wind Speed: ${windSpeed} mph</p>
                    <p>Wind Chill: ${windChillTemperature}°F</p>
                `;
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                document.getElementById('weather').innerHTML = '<p>Failed to fetch weather data</p>';
            });
    });

// Fetch forecast data
fetch(forecastUrl)
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        return response.json();
    })
    .then(data => {
        const dailyForecasts = data.DailyForecasts;
        const forecastDiv = document.getElementById('forecast');
        forecastDiv.innerHTML = '<h2>5-Day Forecast:</h2>';
        dailyForecasts.forEach(forecast => {
            const date = new Date(forecast.Date);
            const day = date.toLocaleDateString('en-US', { weekday: 'short' });
            const forecastDate = date.toLocaleDateString('en-US');
            const temperatureMin = forecast.Temperature.Minimum.Value;
            const temperatureMax = forecast.Temperature.Maximum.Value;
            const dayIcon = forecast.Day.Icon;
            const nightIcon = forecast.Night.Icon;
            const daySummary = forecast.Day.ShortPhrase;
            const nightSummary = forecast.Night.ShortPhrase;
            const precipitationDay = forecast.Day.PrecipitationProbability;
            const precipitationNight = forecast.Night.PrecipitationProbability;

            forecastDiv.innerHTML += `
                <div class="forecast-item">
                    <div>
                        <p class="day-text">${day}</p>
                        <p class="forecast-date">${forecastDate}</p>
                    </div>
                    <img class="forecast-icon" src="https://www.awxcdn.com/adc-assets/images/weathericons/${dayIcon}.svg" alt="Day">
                    <div class="high-low-container">
                        <p><span class="high-temp">${temperatureMax}°F</span></p>
                        <p><span class="low-temp">${temperatureMin}°F</span></p>
                    </div>
                    <div class="summary-container">
                        <p class="day-summary">${daySummary}</p>
                        <div class="night-summary">
                            <img class="night-icon" src="https://www.awxcdn.com/adc-assets/images/weathericons/${nightIcon}.svg" alt="Night">
                            <p>${nightSummary}</p>
                        </div>
                    </div>
                    <div class="precipitation">
                        <img src="https://raw.githubusercontent.com/JayceDeAtley/weather/61ba6e6c0c8c3b729e67d04047250f1b0f1317f1/img/precip-icon.svg" alt="Precipitation">
                        <span>${precipitationDay}%</span>
                    </div>
                </div>
            `;
        });
    })
    .catch(error => {
        console.error('Error fetching forecast data:', error);
        document.getElementById('forecast').innerHTML = '<p>Failed to fetch forecast data</p>';
    });

// Initialize the map and add OpenWeatherMap layers
const apiKey = '4d27ff267559567f0b5c03e63db6cbdd'; // Your OpenWeatherMap API key

// Initialize the map
const map = L.map('map').setView([31.0, -99.0], 6); // Center on Texas, zoom level 6

// Add the base map layer (similar to OpenWeatherMap's style)
L.tileLayer(
    `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`,
    {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18,
    }
).addTo(map);

// Add OpenWeatherMap precipitation layer (with styling closer to their website)
const precipitationLayer = L.tileLayer(
    `https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${apiKey}`,
    {
        attribution: '© OpenWeatherMap',
        opacity: 0.7, // Adjust opacity as needed
    }
).addTo(map);

// Add OpenWeatherMap clouds layer (optional, for more detail)
const cloudsLayer = L.tileLayer(
    `https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${apiKey}`,
    {
        attribution: '© OpenWeatherMap',
        opacity: 0.5, // Adjust opacity as needed
    }
).addTo(map);

// Add OpenWeatherMap temperature layer (optional, for more detail)
const temperatureLayer = L.tileLayer(
    `https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${apiKey}`,
    {
        attribution: '© OpenWeatherMap',
        opacity: 0.5, // Adjust opacity as needed
    }
).addTo(map);

// Add layer control to toggle layers
const baseMaps = {
    "Base Map": L.tileLayer(
        `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`,
        {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 18,
        }
    ),
};

const overlayMaps = {
    "Precipitation": precipitationLayer,
    "Clouds": cloudsLayer,
    "Temperature": temperatureLayer,
};

L.control.layers(baseMaps, overlayMaps).addTo(map);