document.addEventListener('DOMContentLoaded', function() {
  // --- Define full mappings for daytime conditions (AccuWeather-style) ---
  const nwsToOriginalIconMappingDay = {
    'Clear': '1',
    'Mostly Clear': '2',
    'Mostly Sunny': '2',
    'Partly Cloudy': '3',
    'Partly Sunny': '3',
    'Mostly Cloudy': '6',
    'Cloudy': '7',
    'Overcast': '8',
    'Fog': '11',
    'Dense Fog': '11',
    'Haze': '5',
    'Smoke': '5',
    'Drizzle': '12',
    'Rain': '18',
    'Heavy Rain': '18',
    'Freezing Rain': '26',
    'Sleet': '25',
    'Snow': '22',
    'Heavy Snow': '22',
    'Blowing Snow': '22',
    'Snow Showers': '22',
    'Snow Flurries': '22',
    'Thunderstorm': '15',
    'Severe Thunderstorm': '15',
    'Tornado': '15',
    'Hurricane': '15',
    'Tropical Storm': '15',
    'Blizzard': '19',
    'Ice Storm': '24',
    'Windy': '32',
    'Breezy': '32',
    'Gusty Winds': '32',
    'Calm': '2',
    'Hot': '30',
    'Cold': '31',
    'Frost': '24',
    'Freeze': '24',
    'Dust Storm': '5',
    'Sandstorm': '5',
    'Hail': '25',
    'Freezing Fog': '11',
    'Patchy Fog': '11',
    'Light Rain': '13',
    'Light Snow': '20',
    'Scattered Showers': '13',
    'Isolated Thunderstorms': '16'
  };

  const nwsToOriginalIconMappingNight = {
    'Clear': '33',
    'Mostly Clear': '34',
    'Partly Cloudy': '35',
    'Mostly Cloudy': '38',
    'Cloudy': '7',
    'Overcast': '8',
    'Fog': '11',
    'Dense Fog': '11',
    'Haze': '37',
    'Smoke': '37',
    'Drizzle': '39',
    'Rain': '18',
    'Heavy Rain': '18',
    'Freezing Rain': '26',
    'Sleet': '25',
    'Snow': '22',
    'Heavy Snow': '22',
    'Blowing Snow': '22',
    'Snow Showers': '22',
    'Snow Flurries': '22',
    'Thunderstorm': '15',
    'Severe Thunderstorm': '15',
    'Tornado': '32',
    'Hurricane': '32',
    'Tropical Storm': '15',
    'Blizzard': '22',
    'Ice Storm': '24',
    'Windy': '32',
    'Breezy': '32',
    'Gusty Winds': '32',
    'Calm': '34',
    'Hot': '30',
    'Cold': '31',
    'Frost': '24',
    'Freeze': '24',
    'Dust Storm': '37',
    'Sandstorm': '37',
    'Hail': '25',
    'Freezing Fog': '11',
    'Patchy Fog': '11',
    'Light Rain': '39',
    'Light Snow': '44',
    'Scattered Showers': '40',
    'Isolated Thunderstorms': '42'
  };

  // Function to return the original icon URL based on the short forecast and time of day.
  const getOriginalIconUrl = (shortForecast, isDaytime = true) => {
    const mapping = isDaytime ? nwsToOriginalIconMappingDay : nwsToOriginalIconMappingNight;
    for (const key in mapping) {
      if (shortForecast.includes(key)) {
        return `https://www.awxcdn.com/adc-assets/images/weathericons/${mapping[key]}.svg`;
      }
    }
    // Fallback if no mapping is found:
    return `https://www.awxcdn.com/adc-assets/images/weathericons/${isDaytime ? '1' : '33'}.svg`;
  };

  // Precipitation icon URL (using your original icon)
  const precipIconUrl = "https://raw.githubusercontent.com/JayceDeAtley/weather/61ba6e6c0c8c3b729e67d04047250f1b0f1317f1/img/precip-icon.svg";

  // Coordinates for Hico, TX (approximate)
  const lat = 31.064;
  const lon = -98.424;

  // Get grid and station info from the NWS API using the points endpoint
  fetch(`https://api.weather.gov/points/${lat},${lon}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch points data');
      }
      return response.json();
    })
    .then(data => {
      const gridId = data.properties.gridId;
      const gridX = data.properties.gridX;
      const gridY = data.properties.gridY;
      const observationStationsUrl = data.properties.observationStations;

      // --- CURRENT CONDITIONS ---
      // Get list of observation stations and then fetch the latest observation from the first station.
      fetch(observationStationsUrl)
        .then(response => response.json())
        .then(stationsData => {
          if (stationsData.features && stationsData.features.length > 0) {
            const stationId = stationsData.features[0].properties.stationIdentifier;
            const latestObservationUrl = `https://api.weather.gov/stations/${stationId}/observations/latest`;
            return fetch(latestObservationUrl);
          } else {
            throw new Error('No observation stations found');
          }
        })
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to fetch latest observation');
          }
          return response.json();
        })
        .then(observationData => {
          const obs = observationData.properties;
          // Temperature is given in Celsius; convert to Fahrenheit
          const temperatureC = obs.temperature.value;
          const temperatureF = temperatureC !== null ? ((temperatureC * 9/5) + 32).toFixed(1) : 'N/A';
          // Wind speed in m/s; convert to mph (1 m/s = 2.23694 mph)
          const windSpeedMs = obs.windSpeed.value;
          const windSpeedMph = windSpeedMs !== null ? (windSpeedMs * 2.23694).toFixed(1) : 'N/A';
          // Relative humidity (as percentage)
          const humidity = obs.relativeHumidity && obs.relativeHumidity.value !== null 
                           ? obs.relativeHumidity.value.toFixed(0) 
                           : 'N/A';
          // Visibility is given in meters; convert to miles (1 meter = 0.000621371 miles)
          const visibilityMeters = obs.visibility && obs.visibility.value;
          const visibilityMiles = visibilityMeters !== null && visibilityMeters !== undefined 
                                  ? (visibilityMeters * 0.000621371).toFixed(1) 
                                  : 'N/A';
          const description = obs.textDescription || 'No description';
          // For current conditions, assume daytime.
          const iconUrl = getOriginalIconUrl(description, true);
  
          document.getElementById('weatherIcon').innerHTML = iconUrl
            ? `<img src="${iconUrl}" alt="Weather Icon">`
            : '';
          document.getElementById('weather').innerHTML = `
            <h3 style="color: black;">${description}</h3>
            <p>Temperature: ${temperatureF}°F</p>
            <p>Humidity: ${humidity}%</p>
            <p>Wind Speed: ${windSpeedMph} mph</p>
            <p>Visibility: ${visibilityMiles} miles</p>
          `;
        })
        .catch(error => {
          console.error('Error fetching current observation data:', error);
          document.getElementById('weather').innerHTML = '<p>Failed to fetch current weather data</p>';
        });
  
      // --- 7-DAY FORECAST (Grouped High & Low with separate Day & Night summaries and precipitation chance) ---
      fetch(`https://api.weather.gov/gridpoints/${gridId}/${gridX},${gridY}/forecast`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to fetch forecast data');
          }
          return response.json();
        })
        .then(forecastData => {
          const periods = forecastData.properties.periods;
          const forecastDiv = document.getElementById('forecast');
          forecastDiv.innerHTML = '<h2>7-Day Forecast</h2>';
          
          // Group periods into days (each day has a daytime and nighttime period)
          for (let i = 0; i < periods.length; i++) {
            if (!periods[i].isDaytime) continue;
            
            const dayPeriod = periods[i];
            const nightPeriod = periods[i+1] && !periods[i+1].isDaytime ? periods[i+1] : null;
            const startTime = new Date(dayPeriod.startTime);
            const dayName = startTime.toLocaleDateString('en-US', { weekday: 'short' });
            const forecastDate = startTime.toLocaleDateString('en-US');
            
            // Use 0% as default if precipitation chance is missing or null.
            const precipProbDay = (dayPeriod.probabilityOfPrecipitation &&
                                   dayPeriod.probabilityOfPrecipitation.value !== null)
                                   ? dayPeriod.probabilityOfPrecipitation.value : 0;
  
            forecastDiv.innerHTML += `
              <div class="forecast-item">
                <div>
                  <p class="day-text">${dayName}</p>
                  <p class="forecast-date">${forecastDate}</p>
                </div>
                <img class="forecast-icon" src="${getOriginalIconUrl(dayPeriod.shortForecast, true)}" alt="Day Forecast Icon">
                <div class="high-low-container">
                  <p><span class="high-temp">${dayPeriod.temperature}°${dayPeriod.temperatureUnit}</span></p>
                  <p><span class="low-temp">${nightPeriod ? nightPeriod.temperature + '°' + nightPeriod.temperatureUnit : 'N/A'}</span></p>
                </div>
                <div class="summary-container">
                  <p class="day-summary">${dayPeriod.shortForecast}</p>
                  <div class="night-summary">
                    <img class="night-icon" src="${nightPeriod ? getOriginalIconUrl(nightPeriod.shortForecast, false) : ''}" alt="Night Forecast Icon">
                    <p>${nightPeriod ? nightPeriod.shortForecast : ''}</p>
                  </div>
                </div>
                <div class="precipitation">
                  <img src="${precipIconUrl}" alt="Precipitation">
                  <span>${precipProbDay}%</span>
                </div>
              </div>
            `;
            if (nightPeriod) i++;
          }
        })
        .catch(error => {
          console.error('Error fetching forecast data:', error);
          document.getElementById('forecast').innerHTML = '<p>Failed to fetch forecast data</p>';
        });
  
      // --- HOURLY FORECAST (with precipitation chance) using NOAA/NWS API ---
      fetch(`https://api.weather.gov/gridpoints/${gridId}/${gridX},${gridY}/forecast/hourly`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to fetch hourly forecast data');
          }
          return response.json();
        })
        .then(hourlyData => {
          const periods = hourlyData.properties.periods;
          const hourlyForecastDiv = document.getElementById('hourlyForecast');
          hourlyForecastDiv.innerHTML = '';
          periods.forEach(hour => {
            const startTime = new Date(hour.startTime);
            const time = startTime.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
            const temperature = hour.temperature;
            const temperatureUnit = hour.temperatureUnit;
            // Determine if it's day or night: assume 6 AM to 6 PM is day.
            const hourOfDay = startTime.getHours();
            const isDaytime = (hourOfDay >= 6 && hourOfDay < 18);
            const iconUrl = getOriginalIconUrl(hour.shortForecast, isDaytime);
            // Use 0% as default if precipitation chance is missing or null.
            const precipProbHourly = (hour.probabilityOfPrecipitation &&
                                      hour.probabilityOfPrecipitation.value !== null)
                                      ? hour.probabilityOfPrecipitation.value : 0;
            const hourlyItem = document.createElement('div');
            hourlyItem.className = 'hourly-item';
            hourlyItem.innerHTML = `
              <div class="time">${time}</div>
              <img class="weather-icon" src="${iconUrl}" alt="Weather Icon">
              <div class="temperature">${temperature}°${temperatureUnit}</div>
              <!-- Description now appears first -->
              <div class="precipitation">
                <span>${hour.shortForecast}</span>
              </div>
              <!-- Precipitation chance appears after the description -->
              <div class="precipitation">
                <img src="${precipIconUrl}" alt="Precipitation">
                <span>${precipProbHourly}%</span>
              </div>
            `;
            hourlyForecastDiv.appendChild(hourlyItem);
          });
        })
        .catch(error => {
          console.error('Error fetching hourly forecast data:', error);
          document.getElementById('hourlyForecast').innerHTML = '<p>Failed to fetch hourly forecast data</p>';
        });
    })
    .catch(error => {
      console.error('Error fetching points data:', error);
    });
  
    // --- ALERTS ---
    const alertContainer = document.getElementById('alert-container');
    const alertText = document.querySelector('#alert-container .alert-text');
    fetch('https://api.weather.gov/alerts/active?zone=TXZ143')
      .then(response => response.json())
      .then(data => {
        if (data.features && data.features.length > 0) {
          const alertData = data.features[0].properties;
          const event = alertData.event;
          const endDate = new Date(alertData.ends).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
          });
          alertText.textContent = `${event} until ${endDate}`;
          alertContainer.style.display = 'flex';
        } else {
          alertContainer.style.display = 'none';
        }
      })
      .catch(error => {
        console.error('Error fetching alerts:', error);
        alertContainer.style.display = 'none';
      });
  
    // --- MAP (NOAA Radar) ---
    const map = L.map('map').setView([31.0, -99.0], 6);
    const openStreetMapLayer = L.tileLayer(
      `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`,
      {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 18,
      }
    ).addTo(map);
  
    setTimeout(function () {
      map.invalidateSize();
    }, 500);
  
    window.addEventListener('resize', function () {
      map.invalidateSize();
    });
  
    const noaaRadarLayer = L.tileLayer(
      `https://mesonet.agron.iastate.edu/cache/tile.py/1.0.0/nexrad-n0q-900913/{z}/{x}/{y}.png`,
      {
        attribution: 'Radar data &copy; <a href="https://www.noaa.gov/">NOAA</a> & <a href="https://www.weather.gov/">NWS</a>',
        opacity: 0.7,
      }
    ).addTo(map);
  
    const baseMaps = {
      "OpenStreetMap": openStreetMapLayer,
    };
  
    const overlayMaps = {
      "NOAA/NWS Radar": noaaRadarLayer,
    };
  
    L.control.layers(baseMaps, overlayMaps).addTo(map);
});
