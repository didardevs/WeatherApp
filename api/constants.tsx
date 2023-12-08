export const apiKey = '6bf07afb54aa4ff1b6310538230712';

type WeatherCondition =
  | 'Partly cloudy'
  | 'Moderate rain'
  | 'Patchy rain possible'
  | 'Sunny'
  | 'Clear'
  | 'Overcast'
  | 'Cloudy'
  | 'Light rain'
  | 'Moderate rain at times'
  | 'Heavy rain'
  | 'Heavy rain at times'
  | 'Moderate or heavy freezing rain'
  | 'Moderate or heavy rain shower'
  | 'Moderate or heavy rain with thunder'
  | 'Mist'
  | 'other';

type WeatherImageAssets = {
  [key in WeatherCondition]: number;
};

export const weatherImages: WeatherImageAssets = {
  'Partly cloudy': require('../assets/images/partlycloudy.png'),
  'Moderate rain': require('../assets/images/moderaterain.png'),
  'Patchy rain possible': require('../assets/images/moderaterain.png'),
  Sunny: require('../assets/images/sun.png'),
  Clear: require('../assets/images/sun.png'),
  Overcast: require('../assets/images/cloud.png'),
  Cloudy: require('../assets/images/cloud.png'),
  'Light rain': require('../assets/images/moderaterain.png'),
  'Moderate rain at times': require('../assets/images/moderaterain.png'),
  'Heavy rain': require('../assets/images/heavyrain.png'),
  'Heavy rain at times': require('../assets/images/heavyrain.png'),
  'Moderate or heavy freezing rain': require('../assets/images/heavyrain.png'),
  'Moderate or heavy rain shower': require('../assets/images/heavyrain.png'),
  'Moderate or heavy rain with thunder': require('../assets/images/heavyrain.png'),
  Mist: require('../assets/images/mist.png'),
  other: require('../assets/images/moderaterain.png'),
};

export function isWeatherCondition(
  condition: string,
): condition is WeatherCondition {
  return condition in weatherImages;
}
