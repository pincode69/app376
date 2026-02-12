import AsyncStorage from '@react-native-async-storage/async-storage';
import { AURA_GAME_RESULTS } from '../data/data';
import { getTotalMeditationTime } from './meditationHistory';

const GAME_HISTORY_KEY = '@aura_history';

export const COLOR_NAMES: Record<string, string> = {
  '#E84C4C': 'Red',
  '#FF9F43': 'Orange',
  '#FFD84D': 'Yellow',
  '#4CD964': 'Green',
  '#5AC8FA': 'Cyan',
  '#3A6FF7': 'Blue',
  '#FF7EB6': 'Pink',
  '#C9CCD6': 'Silver',
  '#000000': 'Black',
};

export const COLOR_HEX: Record<string, string> = {
  '#E84C4C': '#E84C4C',
  '#FF9F43': '#FF9F43',
  '#FFD84D': '#FFD84D',
  '#4CD964': '#4CD964',
  '#5AC8FA': '#5AC8FA',
  '#3A6FF7': '#3A6FF7',
  '#FF7EB6': '#FF7EB6',
  '#C9CCD6': '#C9CCD6',
  '#000000': '#000000',
};

export type GameHistoryItem = {
  id: string;
  timestamp: number;
  timeSpent: number;
  collectedAuraParts: Record<string, number>;
  dominantColor: string;
};

export const getAllGameHistory = async (): Promise<GameHistoryItem[]> => {
  try {
    const historyJson = await AsyncStorage.getItem(GAME_HISTORY_KEY);
    if (!historyJson) return [];
    return JSON.parse(historyJson);
  } catch (error) {
    console.error('Error loading game history:', error);
    return [];
  }
};

export const getWeeklyHistory = async (): Promise<GameHistoryItem[]> => {
  const allHistory = await getAllGameHistory();
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  return allHistory.filter((item) => item.timestamp >= weekAgo);
};

export const getMonthlyHistory = async (): Promise<GameHistoryItem[]> => {
  const allHistory = await getAllGameHistory();
  const monthAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
  return allHistory.filter((item) => item.timestamp >= monthAgo);
};

export const calculateAverageColors = (
  history: GameHistoryItem[]
): Record<string, number> => {
  if (history.length === 0) return {};

  const colorTotals: Record<string, number> = {};
  const colorCounts: Record<string, number> = {};

  history.forEach((item) => {
    Object.entries(item.collectedAuraParts).forEach(([color, count]) => {
      if (!colorTotals[color]) {
        colorTotals[color] = 0;
        colorCounts[color] = 0;
      }
      colorTotals[color] += count;
      colorCounts[color] += 1;
    });
  });

  const averages: Record<string, number> = {};
  Object.keys(colorTotals).forEach((color) => {
    averages[color] = colorTotals[color] / colorCounts[color];
  });

  return averages;
};

export const getDominantColor = (
  averages: Record<string, number>
): { color: string; hex: string; name: string; description: string } | null => {
  if (Object.keys(averages).length === 0) return null;

  let maxCount = 0;
  let dominantColor = '';

  Object.entries(averages).forEach(([color, count]) => {
    if (count > maxCount) {
      maxCount = count;
      dominantColor = color;
    }
  });

  if (!dominantColor) return null;

  const options = AURA_GAME_RESULTS[dominantColor as keyof typeof AURA_GAME_RESULTS];
  const description = options && options.length > 0 ? options[0].description : '';

  return {
    color: dominantColor,
    hex: COLOR_HEX[dominantColor] || dominantColor,
    name: COLOR_NAMES[dominantColor] || 'Unknown',
    description,
  };
};

export const calculateBalance = async (
  averages: Record<string, number>
): Promise<Array<{ color: string; percent: number; hex: string }>> => {
  const total = Object.values(averages).reduce((sum, count) => sum + count, 0);
  if (total === 0) return [];

  const totalMeditationTime = await getTotalMeditationTime();
  const meditationHours = totalMeditationTime / 3600;
  const meditationBalanceFactor = Math.min(meditationHours / 10, 0.7);

  const allColors = Object.keys(averages);
  const balancedPercent = allColors.length > 0 ? 100 / allColors.length : 0;

  const rawBalances = Object.entries(averages).map(([color, count]) => ({
    color,
    rawPercent: (count / total) * 100,
  }));

  return rawBalances
    .map(({ color, rawPercent }) => {
      const adjustedPercent = rawPercent * (1 - meditationBalanceFactor) + 
                             balancedPercent * meditationBalanceFactor;
      
      return {
        color: COLOR_NAMES[color] || color,
        percent: Math.max(1, Math.round(adjustedPercent)),
        hex: COLOR_HEX[color] || color,
      };
    })
    .sort((a, b) => b.percent - a.percent);
};

export const getTopColorsStats = (
  averages: Record<string, number>,
  limit: number = 3
): Array<{ color: string; value: number }> => {
  return Object.entries(averages)
    .map(([color, count]) => ({
      color: COLOR_NAMES[color] || color,
      value: Math.round(count),
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, limit);
};
