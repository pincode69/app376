import AsyncStorage from '@react-native-async-storage/async-storage';

const MEDITATION_HISTORY_KEY = '@meditation_history';

export type MeditationItem = {
  id: string;
  date: string;
  duration: number;
  timestamp: number;
};

export const saveMeditation = async (duration: number): Promise<void> => {
  try {
    const historyJson = await AsyncStorage.getItem(MEDITATION_HISTORY_KEY);
    const history: MeditationItem[] = historyJson ? JSON.parse(historyJson) : [];
    
    const newItem: MeditationItem = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      duration,
      timestamp: Date.now(),
    };
    
    history.push(newItem);
    await AsyncStorage.setItem(MEDITATION_HISTORY_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Error saving meditation:', error);
  }
};

export const getAllMeditations = async (): Promise<MeditationItem[]> => {
  try {
    const historyJson = await AsyncStorage.getItem(MEDITATION_HISTORY_KEY);
    if (!historyJson) return [];
    return JSON.parse(historyJson);
  } catch (error) {
    console.error('Error loading meditation history:', error);
    return [];
  }
};

export const clearMeditationHistory = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(MEDITATION_HISTORY_KEY);
  } catch (error) {
    console.error('Error clearing meditation history:', error);
  }
};

export const getTotalMeditationTime = async (): Promise<number> => {
  try {
    const meditations = await getAllMeditations();
    return meditations.reduce((sum, m) => sum + m.duration, 0);
  } catch (error) {
    console.error('Error calculating total meditation time:', error);
    return 0;
  }
};

export const getWeeklyMeditationTime = async (): Promise<number> => {
  try {
    const all = await getAllMeditations();
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const weekly = all.filter((item) => item.timestamp >= weekAgo);
    return weekly.reduce((sum, m) => sum + m.duration, 0);
  } catch (error) {
    console.error('Error calculating weekly meditation time:', error);
    return 0;
  }
};

export const getMonthlyMeditationTime = async (): Promise<number> => {
  try {
    const all = await getAllMeditations();
    const monthAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const monthly = all.filter((item) => item.timestamp >= monthAgo);
    return monthly.reduce((sum, m) => sum + m.duration, 0);
  } catch (error) {
    console.error('Error calculating monthly meditation time:', error);
    return 0;
  }
};

export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};
