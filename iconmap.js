  const nwsToOriginalIconMappingDay = {
    'Clear': 'clear-day',
    'Sunny': 'clear-day',
    'Mostly Clear': 'partly-cloudy-day',
    'Mostly Sunny': 'partly-cloudy-day',
    'Partly Cloudy': 'partly-cloudy-day',
    'Partly Sunny': 'partly-cloudy-day',
    'Mostly Cloudy': 'partly-cloudy-day',
    'Cloudy': 'cloudy',
    'Overcast': 'overcast-day',
    'Fog': 'fog',
    'Dense Fog': 'extreme-fog',
    'Haze': 'haze',
    'Smoke': 'smoke',
    'Drizzle': 'drizzle',
    'Rain': 'rain',
    'Heavy Rain': 'rain',
    'Freezing Rain': 'rain',
    'Sleet': 'sleet',
    'Snow': 'snow',
    'Heavy Snow': 'snow',
    'Blowing Snow': 'wind-snow',
    'Snow Showers': 'snow',
    'Snow Flurries': 'snow',
    'Thunderstorm': 'thunderstorms',
    'Severe Thunderstorm': 'thunderstorms-extreme',
    'Tornado': 'tornado',
    'Hurricane': 'hurricane',
    'Tropical Storm': 'hurrincane',
    'Tropical Depression': 'hurricane',
    'Blizzard': 'snow',
    'Ice Storm': 'hail',
    'Windy': 'wind',
    'Breezy': 'wind',
    'Gusty Winds': 'wind',
    'Calm': 'partly-cloudy-day',
    'Hot': 'thermometer-mercury',
    'Cold': 'thermometer-mercury-cold',
    'Frost': 'snowflake',
    'Freeze': 'snowflake',
    'Dust Storm': 'dust-wind',
    'Sandstorm': 'dust-wind',
    'Hail': 'hail',
    'Freezing Fog': 'fog',
    'Patchy Fog': 'fog-day',
    'Light Rain': 'rain',
    'Light Snow': 'snow',
    'Scattered Showers': 'rain',
    'Isolated Thunderstorms': 'thunderstorms-day',
    'Mist': 'mist',
    'Hurricane Warning': 'flag-hurricane-warning',
    'Gale Warning': 'flag-gale-warning'
  };

  const nwsToOriginalIconMappingNight = {
    'Clear': 'clear-night',
    'Moony': 'clear-night',
    'Mostly Clear': 'partly-cloudy-night',
    'Partly Cloudy': 'partly-cloudy-night',
    'Partly Clear': 'partly-cloudy-night',
    'Mostly Cloudy': 'partly-cloudy-night',
    'Cloudy': 'cloudy',
    'Overcast': 'overcast-night',
    'Fog': 'fog',
    'Dense Fog': 'extreme-fog',
    'Haze': 'haze',
    'Smoke': 'smoke',
    'Drizzle': 'drizzle',
    'Rain': 'rain',
    'Heavy Rain': 'rain',
    'Freezing Rain': 'rain',
    'Sleet': 'sleet',
    'Snow': 'snow',
    'Heavy Snow': 'snow',
    'Blowing Snow': 'wind-snow',
    'Snow Showers': 'snow',
    'Snow Flurries': 'snow',
    'Thunderstorm': 'thunderstorms',
    'Severe Thunderstorm': 'thunderstorms-extreme',
    'Tornado': 'tornado',
    'Hurricane': 'hurricane',
    'Tropical Storm': 'hurrincane',
    'Tropical Depression': 'hurricane',
    'Blizzard': 'snow',
    'Ice Storm': 'hail',
    'Windy': 'wind',
    'Breezy': 'wind',
    'Gusty Winds': 'wind',
    'Calm': 'partly-cloudy-night',
    'Hot': 'thermometer-mercury',
    'Cold': 'thermometer-mercury-cold',
    'Frost': 'snowflake',
    'Freeze': 'snowflake',
    'Dust Storm': 'dust-wind',
    'Sandstorm': 'dust-wind',
    'Hail': 'hail',
    'Freezing Fog': 'fog',
    'Patchy Fog': 'fog-night',
    'Light Rain': 'rain',
    'Light Snow': 'snow',
    'Scattered Showers': 'rain',
    'Isolated Thunderstorms': 'thunderstorms-night',
    'Mist': 'mist',
    'Hurricane Warning': 'flag-hurricane-warning',
    'Gale Warning': 'flag-gale-warning'
  };

    // Function to return the original icon URL based on the short forecast and time of day.
    const getOriginalIconUrl = (shortForecast, isDaytime = true) => {
      const mapping = isDaytime ? nwsToOriginalIconMappingDay : nwsToOriginalIconMappingNight;
      for (const key in mapping) {
        if (shortForecast.includes(key)) {
          return `img/basmillus/${mapping[key]}.svg`;
        }
      }
    };