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

        document.getElementById('weatherIcon').innerHTML = `<img src="https://jaycedeatley.github.io/weather/img/${weatherIcon}.svg" alt="Weather Icon">`;

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

                document.getElementById('weatherIcon').innerHTML = `<img src="https://jaycedeatley.github.io/weather/img/${weatherIcon}.svg" alt="Weather Icon">`;

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

            forecastDiv.innerHTML += `
                <div class="forecast-item">
                    <div>
                        <p class="day-text">${day}</p>
                        <p class="forecast-date">${forecastDate}</p>
                    </div>
                    <img class="forecast-icon" src="https://jaycedeatley.github.io/weather/img/${dayIcon}.svg" alt="Day">
                    <div class="high-low-container">
                        <p><span class="high-temp">${temperatureMax}°F</span></p>
                        <p><span class="low-temp">${temperatureMin}°F</span></p>
                    </div>
                    <div class="summary-container">
                        <p class="day-summary">${daySummary}</p>
                        <div class="night-summary">
                            <img class="night-icon" src="https://jaycedeatley.github.io/weather/img/${nightIcon}.svg" alt="Night">
                            <p>${nightSummary}</p>
                        </div>
                    </div>
                </div>
            `;
        });
    })
    .catch(error => {
        console.error('Error fetching forecast data:', error);
        document.getElementById('forecast').innerHTML = '<p>Failed to fetch forecast data</p>';
    });