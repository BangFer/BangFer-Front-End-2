import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveFilter = async (filter) => {
  try {
    await AsyncStorage.setItem('tacticsFilter', JSON.stringify(filter));
  } catch (e) {
    console.error('Failed to save filter to AsyncStorage', e);
  }
};

export const loadFilter = async () => {
  try {
    const filter = await AsyncStorage.getItem('tacticsFilter');
    return filter ? JSON.parse(filter) : null;
  } catch (e) {
    console.error('Failed to load filter from AsyncStorage', e);
    return null;
  }
};