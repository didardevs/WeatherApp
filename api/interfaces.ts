export interface Location {
  name: string;
  country: string;
}

export interface Weather {
  current: {
    temp_c: number;
    condition: {
      text: string;
    };
    wind_kph: number;
    humidity: number;
  };
  location: {
    name: string;
    country: string;
  };
  forecast: {
    forecastday: Array<{
      date: string;
      day: {
        avgtemp_c: number;
        condition: {
          text: string;
        };
      };
      astro: {
        sunrise: string;
      };
    }>;
  };
}
