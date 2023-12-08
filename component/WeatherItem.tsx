import React from 'react';
import {View, Image, Text, StyleSheet} from 'react-native';
import {theme} from '../theme/theme';
import {weatherImages} from '../api/constants';

interface WeatherItemProps {
  item: any;
  dayName: string;
}

const WeatherItem: React.FC<WeatherItemProps> = ({item, dayName}) => (
  <View style={[styles.DayContainer, {backgroundColor: theme.bgWhite(0.15)}]}>
    <Image
      source={weatherImages[item?.day?.condition?.text]}
      style={styles.WeatherIcon}
    />
    <Text style={styles.DayNameText}>{dayName}</Text>
    <Text style={styles.DayTemperatureText}>{item?.day?.avgtemp_c}&#176;</Text>
  </View>
);
const styles = StyleSheet.create({
  DayContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 96,
    borderRadius: 20,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginVertical: 15,
  },
  WeatherIcon: {
    width: 44,
    height: 44,
  },
  DayNameText: {
    color: 'white',
  },
  DayTemperatureText: {
    color: 'white',
    fontSize: 24, // text-xl in Tailwind
    fontWeight: 'bold',
  },
});
export default WeatherItem;
