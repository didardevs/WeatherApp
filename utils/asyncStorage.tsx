import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeData = async (key: string, value: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    if (error instanceof Error) {
      console.log('Error storing value: ', error.message);
    }
  }
};

export const getData = async (key: string): Promise<string | null> => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      // We have data!!
      return value;
    }
    return null;
  } catch (error) {
    if (error instanceof Error) {
      console.log('Error retrieving value: ', error.message);
    }
    return null;
  }
};
