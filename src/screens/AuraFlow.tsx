import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  Modal,
  ImageBackground
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '../../_layout';
import { BackIcon } from '../components/icons/BackIcon';
import { BlurView } from '@react-native-community/blur';
import { AURA_GAME_RESULTS } from '../data/data';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const LANE_COUNT = 6;
const ROAD_HEIGHT = SCREEN_HEIGHT - 150;
const ROAD_WIDTH = SCREEN_WIDTH;
const LANE_WIDTH = ROAD_WIDTH / LANE_COUNT;
const BODY_SIZE = LANE_WIDTH;
const AURA_PARTS_WIDTH = LANE_WIDTH;
const AURA_PARTS_HEIGHT = AURA_PARTS_WIDTH;
const GAME_HISTORY_KEY = '@aura_history';
const WIN_THRESHOLD = 20;

const LANES = [0, 1, 2, 3, 4, 5];

const COLOR_NAMES: Record<string, string> = {
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

type AuraParts = {
  id: number;
  lane: number;
  x: number;
  y: Animated.Value;
  color: string;
};

export default function AuraFlowScreen() {
  const navigation = useNavigation<NavigationProp>();

  const [gameStarted, setGameStarted] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [auraParts, setAuraParts] = useState<AuraParts[]>([]);
  const [collectedAuraParts, setCollectedAuraParts] = useState<Record<string, number>>({});
  const [winningColor, setWinningColor] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);

  const TOP_BAR_HEIGHT = 50;
  const STATS_CONTAINER_HEIGHT = 50;
  const CONTROLS_HEIGHT = 60;
  const EMPTY_AURA_BOTTOM = 70;
  
  const initialBodyX = SCREEN_WIDTH - BODY_SIZE;
  const bodyX = useRef(new Animated.Value(initialBodyX)).current;
  const bodyXValue = useRef(initialBodyX);
  
  const gameAreaHeight = SCREEN_HEIGHT - TOP_BAR_HEIGHT - STATS_CONTAINER_HEIGHT - CONTROLS_HEIGHT;
  const bodyBottomFromTop = gameAreaHeight - EMPTY_AURA_BOTTOM;
  const bodyTopFromTop = bodyBottomFromTop - BODY_SIZE;
  
  const gameLoopRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const auraPartsIdCounter = useRef(0);
  const auraPartsPositionsRef = useRef<Map<number, number>>(new Map());
  const auraPartsRef = useRef<AuraParts[]>([]);

  const GOOD_AURA_COLORS = [
    '#E84C4C',
    '#FF9F43',
    '#FFD84D',
    '#4CD964',
    '#5AC8FA',
    '#3A6FF7',
    '#FF7EB6',
    '#C9CCD6',
  ];
  const BLACK_COLOR = '#000000';

  const generateAuraParts = (): AuraParts => {
    const lane = LANES[Math.floor(Math.random() * LANES.length)];
    const isBlack = Math.random() < 0.1;
    const color = isBlack ? BLACK_COLOR : GOOD_AURA_COLORS[Math.floor(Math.random() * GOOD_AURA_COLORS.length)];

    const x = lane * LANE_WIDTH;

    const y = new Animated.Value(-AURA_PARTS_HEIGHT);

    auraPartsIdCounter.current += 1;

    return {
      id: auraPartsIdCounter.current,
      lane,
      x,
      y,
      color,
    };
  };

  const moveAuraParts = (part: AuraParts) => {
    part.y.addListener(({ value }) => {
      auraPartsPositionsRef.current.set(part.id, value);
    });

    Animated.timing(part.y, {
      toValue: ROAD_HEIGHT + AURA_PARTS_HEIGHT,
      duration: 3500 + Math.random() * 1500,
      useNativeDriver: true,
    }).start(() => {
      part.y.removeAllListeners();
      auraPartsPositionsRef.current.delete(part.id);
      setAuraParts((prev) => prev.filter((p) => p.id !== part.id));
    });
  };

  const handleWin = async (color: string, collectedParts: Record<string, number>) => {
    setGameWon(true);
    setGameStarted(false);
    setWinningColor(color);
    if (gameLoopRef.current) clearInterval(gameLoopRef.current);

    try {
      const historyJson = await AsyncStorage.getItem(GAME_HISTORY_KEY);
      const history = historyJson ? JSON.parse(historyJson) : [];
      const timeSpent = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0;
      
      history.push({
        id: Date.now().toString(),
        timestamp: Date.now(),
        timeSpent,
        collectedAuraParts: collectedParts,
        dominantColor: color,
      });
      await AsyncStorage.setItem(GAME_HISTORY_KEY, JSON.stringify(history));
    } catch (error) {
      console.error('Error saving game history:', error);
    }

    auraPartsRef.current.forEach((part: AuraParts) => part.y.stopAnimation());
  };

  const collectAuraPart = (color: string) => {
    setCollectedAuraParts((prev) => {
      const newCount = (prev[color] || 0) + 1;
      const updated = { ...prev, [color]: newCount };
      
      if (newCount >= WIN_THRESHOLD) {
        handleWin(color, updated);
      }
      
      return updated;
    });
  };

  const moveLeft = () => {
    if (gameWon) return;
    const newValue = Math.max(0, bodyXValue.current - LANE_WIDTH);
    bodyXValue.current = newValue;
    Animated.timing(bodyX, {
      toValue: newValue,
      duration: 100,
      useNativeDriver: false,
    }).start();
  };

  const moveRight = () => {
    if (gameWon) return;
    const newValue = Math.min(SCREEN_WIDTH - BODY_SIZE, bodyXValue.current + LANE_WIDTH);
    bodyXValue.current = newValue;
    Animated.timing(bodyX, {
      toValue: newValue,
      duration: 100,
      useNativeDriver: false,
    }).start();
  };

  const getDominantColor = () => {
    let max = 0;
    let dominant: string | null = null;

    Object.entries(collectedAuraParts).forEach(([color, count]) => {
      if (count > max) {
        max = count;
        dominant = color;
      }
    });

    return { dominant, count: max };
  };

  const getTopThreeColors = () => {
    if (!winningColor) return [];
    
    const sorted = Object.entries(collectedAuraParts)
      .sort(([, a], [, b]) => b - a)
      .filter(([color]) => color !== winningColor)
      .slice(0, 2)
      .map(([color]) => color);
    
    return [winningColor, ...sorted];
  };

  const getAuraDescription = (color: string) => {
    const colorKey = color as keyof typeof AURA_GAME_RESULTS;
    const options = AURA_GAME_RESULTS[colorKey];
    if (!options || options.length === 0) return '';
    return options[0].description;
  };

  const resetGame = () => {
    const initialValue = SCREEN_WIDTH - BODY_SIZE;
    bodyXValue.current = initialValue;
    bodyX.setValue(initialValue);
    setGameStarted(false);
    setGameWon(false);
    setWinningColor(null);
    setCollectedAuraParts({});
    setStartTime(null);
    auraPartsRef.current.forEach((part) => {
      part.y.stopAnimation();
      part.y.removeAllListeners();
    });
    auraPartsPositionsRef.current.clear();
    if (gameLoopRef.current) clearInterval(gameLoopRef.current);
  };

  useEffect(() => {
    auraPartsRef.current = auraParts;
  }, [auraParts]);

  useEffect(() => {
    const interval = setInterval(() => {
      const part = generateAuraParts();
      setAuraParts((prev) => [...prev, part]);
      moveAuraParts(part);
      if (!gameStarted) {
        setGameStarted(true);
        setStartTime(Date.now());
      }
    }, 1200);

    gameLoopRef.current = interval;
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (gameWon || !gameStarted) return;

    let rafId: number;

    const loop = () => {
      const bodyCenterX = bodyXValue.current;
      const bodyLeft = bodyCenterX;
      const bodyRight = bodyCenterX + BODY_SIZE;

      const allParts = [...auraPartsRef.current];

      allParts.forEach((part) => {
        const partY = auraPartsPositionsRef.current.get(part.id);
        if (partY === undefined) return;

        if (partY > ROAD_HEIGHT + 100) return;

        const partTop = partY;
        const partBottom = partY + AURA_PARTS_HEIGHT;
        const partLeft = part.x;
        const partRight = part.x + AURA_PARTS_WIDTH;

        const verticalOverlap = bodyTopFromTop < partBottom && bodyBottomFromTop > partTop;
        const horizontalOverlap = bodyLeft < partRight && bodyRight > partLeft;

        if (verticalOverlap && horizontalOverlap) {
          collectAuraPart(part.color);
          
          part.y.stopAnimation();
          part.y.removeAllListeners();
          auraPartsPositionsRef.current.delete(part.id);
          setAuraParts((prev) => prev.filter((p) => p.id !== part.id));
        }
      });

      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, [gameWon, gameStarted]);

  return (
    <ImageBackground
      source={require('@assets/images/bg.png')}
      style={styles.bg}
    >
      <SafeAreaProvider style={styles.container}>
        <SafeAreaView style={styles.safeContainer}>
          <View style={styles.topBar}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <BackIcon />
            </TouchableOpacity>
          </View>
          
          <View style={styles.scoreBar}>
            {Object.entries(collectedAuraParts).map(([color, count]) => {
              const isLeader = count === getDominantColor().count && count > 0;
              return (
                <View key={color} style={styles.scoreItem}>
                  <View
                    style={[
                      styles.scoreDot,
                      { backgroundColor: color },
                      isLeader && styles.scoreDotActive,
                    ]}
                  />
                  <Text style={styles.scoreText}>
                    {count} / {WIN_THRESHOLD}
                  </Text>
                </View>
              );
            })}
          </View>

          <View style={styles.gameArea}>
            <View style={styles.road}>
              {Array.from({ length: LANE_COUNT }).map((_, index) => {
                return (
                  <View
                    key={index}
                    style={[
                      styles.laneDivider,
                      { left: (index * LANE_WIDTH) },
                    ]}
                  />
                );
              })}
            </View>

            {auraParts.map((auraPart) => (
              <Animated.View
                key={auraPart.id}
                style={[
                  styles.auraPart,
                  {
                    left: auraPart.x,
                    backgroundColor: auraPart.color,
                    transform: [{ translateY: auraPart.y }],
                  },
                ]}
              />
            ))}

            <Animated.View
              style={[
                styles.emptyAura,
                {
                  left: bodyX,
                  bottom: 70,
                },
              ]}
            />
          </View>

          <View style={styles.controls}>
            <TouchableOpacity
              style={styles.controlButton}
              onPress={moveLeft}
              activeOpacity={0.7}
            >
              <Text style={styles.controlButtonText}>← LEFT</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.controlButton}
              onPress={moveRight}
              activeOpacity={0.7}
            >
              <Text style={styles.controlButtonText}>RIGHT →</Text>
            </TouchableOpacity>
          </View>

          <Modal visible={gameWon} transparent animationType="fade">
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <BlurView
                  style={StyleSheet.absoluteFill}
                  blurType="dark"
                  blurAmount={2}
                />
                <Text style={styles.modalTitle}>Aura Complete!</Text>
                {winningColor && (
                  <>
                    <View style={styles.resultAuraCircle}>
                      <View style={[styles.auraCircle, { backgroundColor: winningColor }]} />
                    </View>
                    <Text style={styles.modalSubtitle}>{COLOR_NAMES[winningColor]} Aura</Text>
                    <Text style={styles.modalText}>
                      You collected 20 {COLOR_NAMES[winningColor].toLowerCase()} spheres!{'\n\n'}
                      Total collected: {Object.values(collectedAuraParts).reduce((a, b) => a + b, 0)}
                    </Text>
                    <View style={styles.collectedStats}>
                      {getTopThreeColors().map((color) => {
                        const count = collectedAuraParts[color] || 0;
                        const description = getAuraDescription(color);
                        return (
                          <View key={color} style={styles.collectedStatItemWithDescription}>
                            <View style={styles.collectedStatHeader}>
                              <View style={[styles.collectedColorDot, { backgroundColor: color }]} />
                              <Text style={styles.collectedStatText}>
                                {COLOR_NAMES[color]} — {count}
                              </Text>
                            </View>
                            {description && (
                              <Text style={styles.collectedStatDescription}>{description}</Text>
                            )}
                          </View>
                        );
                      })}
                    </View>
                  </>
                )}
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={styles.modalButton}
                    onPress={resetGame}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.modalButtonText}>Re-check</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.modalButtonSecondary]}
                    onPress={() => navigation.goBack()}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.modalButtonText}>Home</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </SafeAreaView>
      </SafeAreaProvider>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  container: {
    flex: 1,
  },
  safeContainer: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 10,
    paddingHorizontal: 16,
    paddingBottom: 10,
    zIndex: 10,
  },
  backButton: {
    paddingHorizontal: 12
  },
  gameArea: {
    flex: 1,
    width: '100%',
    position: 'relative',
    overflow: 'hidden'
  },
  road: {
    flex: 1,
    backgroundColor: 'rgba(10, 13, 26, 0.5)',
    position: 'relative',
    width: ROAD_WIDTH,
  },
  laneDivider: {
    position: 'absolute',
    width: 2,
    height: '100%',
    backgroundColor: '#9BA4FF',
    opacity: 0,
    top: 0,
    shadowColor: '#9BA4FF',
    shadowOpacity: 0.5,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 0 },
  },
  emptyAura: {
    position: 'absolute',
    width: BODY_SIZE,
    height: BODY_SIZE,
    borderRadius: BODY_SIZE / 2,
    borderWidth: 3,
    borderColor: '#9BA4FF',
    backgroundColor: 'transparent',
    shadowColor: '#9BA4FF',
    shadowOpacity: 0.8,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
  },
  auraPart: {
    position: 'absolute',
    width: AURA_PARTS_WIDTH,
    height: AURA_PARTS_HEIGHT,
    borderRadius: AURA_PARTS_WIDTH / 2,
    opacity: 0.9
  },
  resultAuraCircle: {
    alignItems: 'center',
    marginVertical: 20,
  },
  auraCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    shadowOpacity: 0.8,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
  },
  collectedStats: {
    width: '100%',
    marginVertical: 16,
    gap: 12,
  },
  collectedStatItemWithDescription: {
    width: '100%',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  collectedStatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 6,
  },
  collectedColorDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  collectedStatText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontFamily: 'Inter Tight',
    fontWeight: '500',
  },
  collectedStatDescription: {
    fontSize: 12,
    color: '#CCCCCC',
    fontFamily: 'Inter Tight',
    fontWeight: '400',
    lineHeight: 18,
    paddingLeft: 26,
  },
  modalSubtitle: {
    fontSize: 24,
    fontFamily: 'Cinzel',
    fontWeight: '600',
    color: '#9BA4FF',
    marginBottom: 12,
    letterSpacing: 1.2,
    textShadowColor: 'rgba(155, 164, 255, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 12,
    backgroundColor: 'rgba(15, 18, 36, 0.8)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(155, 164, 255, 0.2)',
    position: 'relative'
  },
  controlButton: {
    padding: 12,
    backgroundColor: '#9BA4FF',
    borderRadius: 8,
    zIndex: 1,
    shadowColor: '#9BA4FF',
    shadowOpacity: 0.6,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  controlButtonText: { 
    fontWeight: 'bold', 
    fontSize: 16,
    color: '#0F1224',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 18, 36, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    overflow: 'hidden',
    borderRadius: 12,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(155, 164, 255, 0.3)',
    backgroundColor: 'rgba(17, 21, 42, 0.95)',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#FFFFFF',
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#FFFFFF',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%'
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: '#9BA4FF',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#9BA4FF',
    shadowOpacity: 0.5,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  modalButtonSecondary: {
    backgroundColor: 'rgba(155, 164, 255, 0.3)',
    borderWidth: 1,
    borderColor: 'rgba(155, 164, 255, 0.5)',
  },
  modalButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#0F1224',
  },
  scoreBar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: 'rgba(15, 18, 36, 0.7)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(155, 164, 255, 0.2)',
  },
  scoreItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  scoreDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    opacity: 0.5,
  },
  scoreDotActive: {
    opacity: 1,
    borderWidth: 2,
    borderColor: '#9BA4FF',
    shadowColor: '#9BA4FF',
    shadowOpacity: 0.8,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
  },
  scoreText: {
    fontFamily: 'Inter Tight',
    fontWeight: '600',
    fontSize: 12,
    color: '#FFFFFF',
  },
});
