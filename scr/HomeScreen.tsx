import React, {useCallback, useEffect, useState} from 'react';
import {
  StatusBar,
  StyleSheet,
  ImageBackground,
  Image,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {CalendarDaysIcon, MapPinIcon} from 'react-native-heroicons/solid';
import {theme} from '../theme/theme';
import {debounce} from 'lodash';
import {fetchLocations, fetchWeatherForecast} from '../api/weather';
import {weatherImages, isWeatherCondition} from '../api/constants';
import {getData, storeData} from '../utils/asyncStorage';
import SearchInput from '../component/SearchInput';
import {Location, Weather} from '../api/interfaces';
import WeatherItem from '../component/WeatherItem';

const HomeScreen = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [locations, setLocations] = useState<Location[]>([]);
  const [weather, setWeather] = useState<Weather | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLocation = (loc: Location) => {
    setLocations([]);
    setShowSearch(false);

    fetchWeatherForecast({cityName: loc.name, days: '7'})
      .then(data => {
        setWeather(data);
        storeData('city', loc.name);
      })
      .catch(err => {
        setError(err.message || 'Failed to fetch weather data');
      });
  };

  const handleSearch = useCallback((value: string) => {
    if (value.length > 2) {
      setIsLoading(true);
      fetchLocations({cityName: value})
        .then(data => {
          setLocations(data);
          setIsLoading(false);
        })
        .catch(err => {
          setError(err.message);
        });
    }
  }, []);

  const handleTextDebounce = debounce(handleSearch, 600);

  useEffect(() => {
    initializeWeatherData();
  }, []);

  const initializeWeatherData = async () => {
    const cityName = await getStoredCity();
    fetchWeatherForCity(cityName);
  };

  const getStoredCity = async () => {
    const storedCity = await getData('city');
    return storedCity || 'New York';
  };

  const fetchWeatherForCity = async (cityName: string) => {
    try {
      const data = await fetchWeatherForecast({cityName: cityName, days: '7'});
      setWeather(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  const renderLocationList = () => (
    <View style={styles.LocationsView}>
      {locations.map((loc, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => handleLocation(loc)}
          style={[
            styles.LocationRow,
            index + 1 !== locations.length && styles.LocationRowBorder,
          ]}>
          <MapPinIcon size="20" color="gray" />
          <Text style={styles.LocationText}>
            {loc?.name}, {loc?.country}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const toggleSearch = () => setShowSearch(!showSearch);

  const {current} = weather || {};
  return (
    <View style={styles.OuterView}>
      <StatusBar barStyle="light-content" />
      <ImageBackground
        source={require('../assets/images/bg.png')}
        style={styles.ImageBackground}
        resizeMode="cover"
        blurRadius={70}>
        <SafeAreaView style={styles.SafeAreaView}>
          <SearchInput
            showSearch={showSearch}
            onSearchChange={handleTextDebounce}
            toggleSearch={toggleSearch}
          />

          {error ? (
            <Text style={styles.ErrorText}>Something went wrong!</Text>
          ) : null}

          {locations.length > 0 && showSearch && renderLocationList()}

          {/* Forecast section */}
          <View style={styles.ForecastContainer}>
            <Text style={styles.LocationNameText}>
              {weather?.location.name}
              <Text style={styles.CountryNameText}>
                {', ' + weather?.location.country}
              </Text>
            </Text>
            <View style={styles.ImageContainer}>
              <Image
                source={
                  isWeatherCondition(weather?.current.condition.text)
                    ? weatherImages[weather?.current.condition.text]
                    : weatherImages['other']
                }
                style={styles.WeatherImage}
              />
            </View>
            <View style={styles.TemperatureContainer}>
              <Text style={styles.TemperatureText}>
                {current?.temp_c}&#176;
              </Text>
              <Text style={styles.ConditionText}>
                {current?.condition?.text}
              </Text>
            </View>
            <View style={styles.container}>
              <View style={styles.StatsView}>
                <Image
                  source={require('../assets/icons/wind.png')}
                  style={styles.StatsIcon}
                />
                <Text style={styles.StatsText}>{current?.wind_kph} km</Text>
              </View>

              <View style={styles.StatsView}>
                <Image
                  source={require('../assets/icons/drop.png')}
                  style={styles.StatsIcon}
                />
                <Text style={styles.StatsText}>{current?.humidity}%</Text>
              </View>

              <View style={styles.StatsView}>
                <Image
                  source={require('../assets/icons/sun.png')}
                  style={styles.StatsIcon}
                />
                <Text style={styles.StatsText}>
                  {weather?.forecast?.forecastday[0]?.astro?.sunrise}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.ForecastDaysContainer}>
            <View style={styles.HeaderRow}>
              <CalendarDaysIcon size={22} color="white" />
              <Text style={styles.HeaderText}>Daily forecast</Text>
            </View>

            <ScrollView
              horizontal
              contentContainerStyle={styles.ScrollViewContent}
              showsHorizontalScrollIndicator={false}>
              {weather?.forecast?.forecastday?.map((item, index) => {
                let date = new Date(item.date);
                let options = {weekday: 'long'};
                let dayName = date.toLocaleDateString('en-US', options);
                dayName = dayName.split(',')[0];
                return (
                  <WeatherItem key={index} item={item} dayName={dayName} />
                );
              })}
            </ScrollView>
          </View>
        </SafeAreaView>
        {isLoading ? (
          <View style={styles.ActivityIndicatorView}>
            <ActivityIndicator
              size={'large'}
              style={styles.ActivityIndicator}
            />
          </View>
        ) : null}
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  ErrorText: {
    color: 'orange',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 5,
    marginHorizontal: 30,
  },
  ActivityIndicator: {
    justifyContent: 'center',
    color: 'white',
    alignSelf: 'center',
  },
  ActivityIndicatorView: {
    position: 'absolute',
    backgroundColor: 'black',
    justifyContent: 'center',
    opacity: 0.5,
    width: '100%',
    height: '100%',
  },
  OuterView: {
    flex: 1,
  },
  ImageBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  SafeAreaView: {
    flex: 1,
  },
  SearchOuterContainer: {
    height: '7%',
  },
  InputContainerComponent: {
    height: '7%',
    flexDirection: 'row',
    marginHorizontal: 20,
    borderRadius: 30,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  TextInputContainer: {
    flex: 1,
    height: 20,
    fontSize: 14,
    color: 'white',
    paddingLeft: 15,
  },
  RoundedButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    paddingHorizontal: 13,
    marginRight: 5,
    borderRadius: 30,
    backgroundColor: theme.bgWhite(0.3),
  },
  LocationsView: {
    position: 'absolute',
    left: 0,
    top: 115,
    right: 0,
    marginHorizontal: 20,
    marginTop: 10,
    backgroundColor: 'white',
    borderRadius: 24,
    zIndex: 10,
  },
  LocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 4,
  },
  LocationRowBorder: {
    borderBottomWidth: 0.5,
    borderColor: 'gray',
  },
  LocationText: {
    color: 'black',
    fontSize: 14,
    marginLeft: 8,
  },
  ForecastContainer: {
    marginHorizontal: 4,
    flex: 1,
    justifyContent: 'space-around',
    marginBottom: 2,
  },
  LocationNameText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
  CountryNameText: {
    fontSize: 20,
    fontWeight: '600',
    color: 'gray',
  },
  ImageContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  WeatherImage: {
    width: 208,
    height: 208,
  },
  TemperatureContainer: {
    marginBottom: 8,
  },
  TemperatureText: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'white',
    fontSize: 48,
    marginLeft: 20,
  },
  ConditionText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 24,
    letterSpacing: 2,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 4,
  },
  StatsView: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  StatsIcon: {
    width: 24,
    height: 24,
  },
  StatsText: {
    paddingLeft: 5,
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  ForecastDaysContainer: {
    marginBottom: 8,
  },
  HeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  HeaderText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 8,
  },
  ScrollViewContent: {
    paddingHorizontal: 15,
  },
});

export default HomeScreen;
