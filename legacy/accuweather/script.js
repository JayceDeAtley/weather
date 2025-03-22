const apiKey1 = 'ERKiWwwk9craOxZg4nODy7K7ps51LF1a';
const apiKey2 = 'GRWCdsnp8Tg5sAGvJJCS5lTI6Cyieogh';
const apiKey3 = 'uwmSyBMGzFZcfo6VG6p90Q8zHgtmc5Pt';
const locationKey = '340850';

// URL for current weather
const currentWeatherUrl = `https://dataservice.accuweather.com/currentconditions/v1/${locationKey}?apikey=${apiKey1}&details=true`;

// URL for 5-day forecast
const forecastUrl = `https://dataservice.accuweather.com/forecasts/v1/daily/5day/${locationKey}?apikey=${apiKey3}&details=true&metric=false`;

// URL for hourly forecast (12-hour)
const hourlyForecastUrl = `https://dataservice.accuweather.com/forecasts/v1/hourly/12hour/${locationKey}?apikey=${apiKey1}&details=true&metric=false`;

// Fetch current weather data
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

// Fetch 5-day forecast data
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
        forecastDiv.innerHTML = '<h2>5-Day Forecast</h2>';
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
    
    document.addEventListener('DOMContentLoaded', function() {
        const alertContainer = document.getElementById('alert-container');
        const alertText = document.querySelector('#alert-container .alert-text');
    
        // Fetch alerts for Hamilton County (adjust the endpoint/zone as needed)
        fetch('https://api.weather.gov/alerts/active?zone=TXZ143')
            .then(response => response.json())
            .then(data => {
                // Check if active alerts exist
                if (data.features && data.features.length > 0) {
                    // For demonstration, take the first active alert
                    const alertData = data.features[0].properties;
                    const event = alertData.event;
                    const endDate = new Date(alertData.ends).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                    });
                    alertText.textContent = `${event} until ${endDate}`;
                    
                    // Make the alert container visible
                    alertContainer.style.display = 'flex';
                } else {
                    // No active alerts found; keep the container hidden
                    alertContainer.style.display = 'none';
                }
            })
            .catch(error => {
                console.error('Error fetching alerts:', error);
                // Optionally hide the container on error
                alertContainer.style.display = 'none';
            });
    });           

    // Fetch hourly forecast data
fetch(hourlyForecastUrl)
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        return response.json();
    })
    .then(data => {
        const hourlyForecastDiv = document.getElementById('hourlyForecast');
        hourlyForecastDiv.innerHTML = ''; // Clear existing content

        data.forEach(hour => {
            const date = new Date(hour.DateTime);
            const time = date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
            const temperature = hour.Temperature.Value;
            const weatherIcon = hour.WeatherIcon;
            const precipitation = hour.PrecipitationProbability;

            const hourlyItem = document.createElement('div');
            hourlyItem.className = 'hourly-item';

            hourlyItem.innerHTML = `
                <div class="time">${time}</div>
                <img class="weather-icon" src="https://www.awxcdn.com/adc-assets/images/weathericons/${weatherIcon}.svg" alt="Weather Icon">
                <div class="temperature">${temperature}°F</div>
                <div class="precipitation">
                    <img src="https://raw.githubusercontent.com/JayceDeAtley/weather/61ba6e6c0c8c3b729e67d04047250f1b0f1317f1/img/precip-icon.svg" alt="Precipitation">
                    <span>${precipitation}%</span>
                </div>
            `;

            hourlyForecastDiv.appendChild(hourlyItem);
        });
    })
    .catch(error => {
        console.error('Error fetching hourly forecast data:', error);
        document.getElementById('hourlyForecast').innerHTML = '<p>Failed to fetch hourly forecast data</p>';
    });

// Initialize the map and add NOAA/NWS layers
const map = L.map('map').setView([31.0, -99.0], 6); // Center on Texas, zoom level 6

// Add the base map layer (OpenStreetMap)
const openStreetMapLayer = L.tileLayer(
    `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`,
    {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 18,
    }
).addTo(map);

setTimeout(function () {
    map.invalidateSize();
}, 500); // Slight delay to allow proper rendering

// Ensure the map resizes properly when the window is resized
window.addEventListener('resize', function () {
    map.invalidateSize();
});

// Add NOAA/NWS radar layer
const noaaRadarLayer = L.tileLayer(
    `https://mesonet.agron.iastate.edu/cache/tile.py/1.0.0/nexrad-n0q-900913/{z}/{x}/{y}.png`,
    {
        attribution: 'Radar data &copy; <a href="https://www.noaa.gov/">NOAA</a> & <a href="https://www.weather.gov/">NWS</a>',
        opacity: 0.7, // Adjust opacity as needed
    }
).addTo(map);

// Add layer control to toggle layers
const baseMaps = {
    "OpenStreetMap": openStreetMapLayer,
};

const overlayMaps = {
    "NOAA/NWS Radar": noaaRadarLayer,
};

L.control.layers(baseMaps, overlayMaps).addTo(map);