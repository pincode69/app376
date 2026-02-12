import React, { useState, useCallback, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Modal,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../_layout';
import HeaderComponent from '../components/HeaderComponent';
import { BackIcon } from '../components/icons/BackIcon';
import { HistoryIcon } from '../components/icons/HistoryIcon';
import { InfoIcon } from '../components/icons/InfoIcon';
import { AuraIcon } from '../components/icons/AuraIcon';
import {
  getAllGameHistory,
  getWeeklyHistory,
  getMonthlyHistory,
  calculateAverageColors,
  getDominantColor,
  calculateBalance,
  getTopColorsStats,
  COLOR_NAMES,
  GameHistoryItem,
} from '../utils/auraStats';
import { COLOR_TO_CHAKRA } from '../data/chakras';
import {
  getAllMeditations,
  clearMeditationHistory,
  formatDuration,
  MeditationItem,
} from '../utils/meditationHistory';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const AURA_ICON_ASPECT_RATIO = 1400 / 1008;
const AURA_ICON_WIDTH = SCREEN_WIDTH - 32;
const AURA_ICON_HEIGHT = AURA_ICON_WIDTH * AURA_ICON_ASPECT_RATIO;

export default function MyAuraScreenScreen() {
  const navigation = useNavigation<NavigationProp>();

  const [dominantAura, setDominantAura] = useState<{
    color: string;
    hex: string;
    name: string;
    description: string;
  } | null>(null);
  const [weeklyStats, setWeeklyStats] = useState<
    Array<{ color: string; value: number }>
  >([]);
  const [monthlyStats, setMonthlyStats] = useState<
    Array<{ color: string; value: number }>
  >([]);
  const [balance, setBalance] = useState<
    Array<{ color: string; percent: number; hex: string }>
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasData, setHasData] = useState(false);
  const [gameHistory, setGameHistory] = useState<GameHistoryItem[]>([]);
  const [meditationHistoryVisible, setMeditationHistoryVisible] = useState(false);
  const [idealAuraVisible, setIdealAuraVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadAuraData();
    }, [])
  );

  const loadAuraData = async () => {
    try {
      const allHistory = await getAllGameHistory();
      setGameHistory(allHistory.slice(-5).reverse());
      
      if (allHistory.length === 0) {
        setHasData(false);
        setIsLoading(false);
        return;
      }

      setHasData(true);

      const weeklyHistory = await getWeeklyHistory();
      const monthlyHistory = await getMonthlyHistory();

      const allAverages = calculateAverageColors(allHistory);
      const weeklyAverages = calculateAverageColors(weeklyHistory);
      const monthlyAverages = calculateAverageColors(monthlyHistory);

      const dominant = getDominantColor(allAverages);
      setDominantAura(dominant);

      const topWeekly = getTopColorsStats(weeklyAverages, 3);
      setWeeklyStats(topWeekly);

      const topMonthly = getTopColorsStats(monthlyAverages, 3);
      setMonthlyStats(topMonthly);

      const balanceData = await calculateBalance(allAverages);
      setBalance(balanceData);
    } catch (error) {
      console.error('Error loading aura data:', error);
      setHasData(false);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
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
          <View style={styles.headerWithButton}>
            <HeaderComponent title="My Aura" />
          </View>
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Loading...</Text>
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  if (!hasData) {
    return (
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
          <View style={styles.headerWithButton}>
            <HeaderComponent title="My Aura" />
            <TouchableOpacity
              style={styles.historyButton}
              onPress={() => setMeditationHistoryVisible(true)}
              activeOpacity={0.7}
            >
              <HistoryIcon />
            </TouchableOpacity>
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.card}>
              <Text style={styles.emptyTitle}>No Aura Data Yet</Text>
              <Text style={styles.emptyDescription}>
                You need to do a check-up of your aura to see results.{'\n\n'}
                Use it in a relaxed, stable state—ideally after meditation—for
                getting more clear information about your aura state.
              </Text>
              <TouchableOpacity
                style={styles.checkButton}
                onPress={() => navigation.navigate('auraFlow')}
                activeOpacity={0.85}
              >
                <Text style={styles.checkButtonText}>Check Your Aura</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return (
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

        <HeaderComponent title="My Aura" />

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.auraIconContainer}>
            <AuraIcon 
              balance={balance}
              width={AURA_ICON_WIDTH}
              height={AURA_ICON_HEIGHT}
            />
            <TouchableOpacity
              style={styles.idealAuraButton}
              onPress={() => setIdealAuraVisible(true)}
              activeOpacity={0.7}
            >
              <InfoIcon />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.historyButton}
              onPress={() => setMeditationHistoryVisible(true)}
              activeOpacity={0.7}
            >
              <HistoryIcon />
            </TouchableOpacity>
          </View>

          {dominantAura && (
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Dominant Aura</Text>

              <View style={styles.dominantContainer}>
                <View
                  style={[
                    styles.auraCircle,
                    { backgroundColor: dominantAura.hex },
                  ]}
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.dominantTitle}>
                    {dominantAura.name}
                  </Text>
                  {dominantAura.description && (
                    <Text style={styles.dominantDescription}>
                      {dominantAura.description}
                    </Text>
                  )}
                </View>
              </View>
            </View>
          )}

          {weeklyStats.length > 0 && (
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Weekly Statistics</Text>
              {weeklyStats.map((item, index) => (
                <StatRow key={index} {...item} />
              ))}
            </View>
          )}

          {monthlyStats.length > 0 && (
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Monthly Statistics</Text>
              {monthlyStats.map((item, index) => (
                <StatRow key={index} {...item} />
              ))}
            </View>
          )}

          {balance.length > 0 && (
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Color Balance</Text>

              {balance.map((item, index) => (
                <View key={index} style={styles.balanceRow}>
                  <Text style={styles.balanceLabel}>{item.color}</Text>
                  <View style={styles.balanceBarBackground}>
                    <View
                      style={[
                        styles.balanceBar,
                        {
                          width: `${item.percent}%`,
                          backgroundColor: item.hex,
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.balancePercent}>
                    {item.percent}%
                  </Text>
                </View>
              ))}
            </View>
          )}

          {gameHistory.length > 0 && (
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Recent Aura Flow Results</Text>
              {gameHistory.map((item) => {
                const date = new Date(item.timestamp);
                const colorCount = Object.keys(item.collectedAuraParts).length;
                const totalCount = Object.values(item.collectedAuraParts).reduce((a, b) => a + b, 0);
                
                return (
                  <View key={item.id} style={styles.historyItem}>
                    <View style={styles.historyHeader}>
                      <Text style={styles.historyDate}>
                        {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </Text>
                      <Text style={styles.historyTime}>{item.timeSpent}s</Text>
                    </View>
                    <View style={styles.historyStats}>
                      <Text style={styles.historyStatText}>
                        Colors: {colorCount} | Total: {totalCount}
                      </Text>
                      <View style={styles.historyColors}>
                        {Object.entries(item.collectedAuraParts).map(([color, count]) => (
                          <View key={color} style={styles.historyColorDot}>
                            <View style={[styles.colorDot, { backgroundColor: color }]} />
                            <Text style={styles.historyColorCount}>{count}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          )}

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Chakra Guidance</Text>
            <Text style={styles.chakraSubtitle}>
              Based on your aura colors, here are the chakras to focus on:
            </Text>
            {Object.entries(COLOR_TO_CHAKRA).map(([colorHex, chakra]) => {
              const colorName = COLOR_NAMES[colorHex] || 'Unknown';
              const hasColor = balance.some(b => b.hex === colorHex);
              
              return (
                <View key={colorHex} style={styles.chakraItem}>
                  <View style={styles.chakraHeader}>
                    <View style={[styles.chakraColorDot, { backgroundColor: chakra.color }]} />
                    <Text style={styles.chakraName}>{chakra.name}</Text>
                    <Text style={styles.chakraColorName}>({colorName})</Text>
                  </View>
                  <Text style={styles.chakraAdvice}>{chakra.advice}</Text>
                </View>
              );
            })}
          </View>
        </ScrollView>

        <MeditationHistoryModal
          visible={meditationHistoryVisible}
          onClose={() => setMeditationHistoryVisible(false)}
        />

        <IdealAuraModal
          visible={idealAuraVisible}
          onClose={() => setIdealAuraVisible(false)}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

function IdealAuraModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const { width: SCREEN_WIDTH } = Dimensions.get('window');
  const AURA_ICON_ASPECT_RATIO = 1400 / 1008;
  const AURA_ICON_WIDTH = SCREEN_WIDTH - 80;
  const AURA_ICON_HEIGHT = AURA_ICON_WIDTH * AURA_ICON_ASPECT_RATIO;

  const idealBalance = [
    { color: 'Red', percent: 100, hex: '#E84C4C' },
    { color: 'Orange', percent: 100, hex: '#FF9F43' },
    { color: 'Yellow', percent: 100, hex: '#FFD84D' },
    { color: 'Green', percent: 100, hex: '#4CD964' },
    { color: 'Cyan', percent: 100, hex: '#5AC8FA' },
    { color: 'Blue', percent: 100, hex: '#3A6FF7' },
    { color: 'Pink', percent: 100, hex: '#FF7EB6' },
  ];

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={stylesIdeal.modalOverlay}>
        <View style={stylesIdeal.modalCard}>
          <Text style={stylesIdeal.modalTitle}>Ideal Aura Balance</Text>

          <View style={stylesIdeal.auraContainer}>
            <AuraIcon 
              balance={idealBalance}
              width={AURA_ICON_WIDTH}
              height={AURA_ICON_HEIGHT}
            />
          </View>

          <ScrollView style={stylesIdeal.textContainer} showsVerticalScrollIndicator={false}>
            <Text style={stylesIdeal.sectionTitle}>Chakra Balancing</Text>
            <Text style={stylesIdeal.bodyText}>
              Balancing chakras is an art accessible to everyone, from simple exercises to complex rituals. Start with awareness: track your emotions to identify blocks. For beginners – daily meditation for 10 minutes, visualizing colors.
              {'\n\n'}
              Breathing practices: deep breathing for Muladhara, as if inhaling the power of the earth – do 5 cycles, feeling stability.
              {'\n\n'}
              Yoga and asanas: for Svadhisthana – butterfly pose, which opens the hips, adding creative flow; advanced add bandhas for enhancement.
              {'\n\n'}
              Crystals and aromas: amethyst for Ajna, lavender for relaxation – hold the crystal in your hand, meditating, and feel the vibration.
              {'\n\n'}
              Mantras and sounds: "Om" for Sahasrara, singing, as if resonance clears the mind; in Tibetan tradition, add bowls for vibrations.
              {'\n\n'}
              Daily rituals: journaling for Vishuddha, writing down thoughts, freeing the voice.
              {'\n\n'}
              These steps are not rigid rules, but flexible tools; experiment, adding personal touches, and you will see how life becomes brighter.
            </Text>
          </ScrollView>

          <TouchableOpacity
            style={stylesIdeal.closeButton}
            onPress={onClose}
            activeOpacity={0.85}
          >
            <Text style={stylesIdeal.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const stylesIdeal = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: '#11152A',
    borderRadius: 22,
    padding: 26,
    borderWidth: 1,
    borderColor: '#ead18e',
    shadowColor: '#ead18e',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 14,
    elevation: 8,
    maxHeight: '90%',
  },
  modalTitle: {
    fontFamily: 'Cinzel',
    fontWeight: '600',
    fontSize: 20,
    color: '#ead18e',
    marginBottom: 20,
    letterSpacing: 1.2,
    textAlign: 'center',
  },
  auraContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  textContainer: {
    maxHeight: 300,
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: 'Cinzel',
    fontWeight: '600',
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 12,
    letterSpacing: 1.2,
  },
  bodyText: {
    fontFamily: 'Cormorant Infant',
    fontSize: 16,
    color: '#DADDF7',
    lineHeight: 24,
  },
  closeButton: {
    paddingVertical: 10,
    paddingHorizontal: 22,
    backgroundColor: '#ead18e',
    borderRadius: 14,
    alignSelf: 'center',
  },
  closeButtonText: {
    fontFamily: 'Inter Tight',
    fontWeight: '700',
    fontSize: 14,
    color: '#0F1224',
    letterSpacing: 1,
  },
});

function MeditationHistoryModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const [meditations, setMeditations] = useState<MeditationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (visible) {
      loadMeditations();
    }
  }, [visible]);

  const loadMeditations = async () => {
    try {
      setIsLoading(true);
      const all = await getAllMeditations();
      setMeditations(all.reverse());
    } catch (error) {
      console.error('Error loading meditations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = async () => {
    await clearMeditationHistory();
    setMeditations([]);
  };

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={stylesHistory.modalOverlay}>
        <View style={stylesHistory.modalCard}>
          <Text style={stylesHistory.modalTitle}>Meditation History</Text>

          {isLoading ? (
            <Text style={stylesHistory.emptyText}>Loading...</Text>
          ) : meditations.length === 0 ? (
            <Text style={stylesHistory.emptyText}>No meditation history yet</Text>
          ) : (
            <View style={stylesHistory.historyList}>
              {meditations.map((item) => {
                const date = new Date(item.date);
                return (
                  <View key={item.id} style={stylesHistory.historyItem}>
                    <View style={stylesHistory.historyItemLeft}>
                      <Text style={stylesHistory.historyDate}>
                        {date.toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </Text>
                      <Text style={stylesHistory.historyTime}>
                        {date.toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </Text>
                    </View>
                    <Text style={stylesHistory.historyDuration}>
                      {formatDuration(item.duration)}
                    </Text>
                  </View>
                );
              })}
            </View>
          )}

          <View style={stylesHistory.modalButtonsRow}>
            {meditations.length > 0 && (
              <TouchableOpacity
                style={stylesHistory.clearButton}
                onPress={handleClear}
                activeOpacity={0.85}
              >
                <Text style={stylesHistory.clearButtonText}>Clear</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={stylesHistory.closeButton}
              onPress={onClose}
              activeOpacity={0.85}
            >
              <Text style={stylesHistory.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const stylesHistory = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: '#11152A',
    borderRadius: 22,
    padding: 26,
    borderWidth: 1,
    borderColor: '#ead18e',
    shadowColor: '#ead18e',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 14,
    elevation: 8,
    maxHeight: '80%',
  },
  modalTitle: {
    fontFamily: 'Cinzel',
    fontWeight: '600',
    fontSize: 20,
    color: '#ead18e',
    marginBottom: 20,
    letterSpacing: 1.2,
  },
  historyList: {
    maxHeight: 400,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2E3570',
  },
  historyItemLeft: {
    flex: 1,
  },
  historyDate: {
    fontFamily: 'Inter Tight',
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: 4,
  },
  historyTime: {
    fontFamily: 'Inter Tight',
    fontSize: 13,
    color: '#9BA4FF',
    fontWeight: '400',
  },
  historyDuration: {
    fontFamily: 'Cinzel',
    fontSize: 18,
    color: '#ead18e',
    fontWeight: '600',
    letterSpacing: 1,
  },
  emptyText: {
    fontFamily: 'Cormorant Infant',
    fontSize: 16,
    color: '#DADDF7',
    textAlign: 'center',
    paddingVertical: 40,
  },
  modalButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 20,
  },
  clearButton: {
    paddingVertical: 10,
    paddingHorizontal: 22,
    backgroundColor: 'transparent',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E84C4C',
  },
  clearButtonText: {
    fontFamily: 'Inter Tight',
    fontWeight: '700',
    fontSize: 14,
    color: '#E84C4C',
    letterSpacing: 1,
  },
  closeButton: {
    paddingVertical: 10,
    paddingHorizontal: 22,
    backgroundColor: '#ead18e',
    borderRadius: 14,
  },
  closeButtonText: {
    fontFamily: 'Inter Tight',
    fontWeight: '700',
    fontSize: 14,
    color: '#0F1224',
    letterSpacing: 1,
  },
});

function StatRow({ color, value }: { color: string; value: number }) {
  return (
    <View style={styles.statRow}>
      <Text style={styles.statColor}>{color}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0E1A',
  },
  safeContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  headerWithButton: {
    position: 'relative',
  },
  historyButton: {
    position: 'absolute',
    right: 0,
    top: 12,
    zIndex: 10,
    padding: 4,
  },
  auraIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    marginBottom: 20,
    position: 'relative',
  },
  idealAuraButton: {
    position: 'absolute',
    top: 50,
    right: 0,
    padding: 8,
    zIndex: 10,
  },
  auraIconHistoryButton: {
    position: 'absolute',
    top: 60,
    right: 0,
    padding: 8,
    zIndex: 10,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    marginBottom: 10,
  },
  backButton: {
    padding: 4,
  },

  card: {
    backgroundColor: '#11152A',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2E3570',
    marginBottom: 20,
  },

  sectionTitle: {
    fontFamily: 'Cinzel',
    fontWeight: '600',
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 14,
    letterSpacing: 1.2,
  },

  dominantContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  auraCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    shadowOpacity: 0.8,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
  },
  dominantTitle: {
    fontFamily: 'Cinzel',
    fontWeight: '600',
    fontSize: 16,
    color: '#FFFFFF',
  },
  dominantDescription: {
    fontFamily: 'CormorantInfant',
    fontWeight: '400',
    fontSize: 15,
    color: '#DADDF7',
    marginTop: 4,
  },

  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  statColor: {
    fontFamily: 'Cormorant Infant',
    fontSize: 15,
    color: '#FFFFFF',
  },
  statValue: {
    fontFamily: 'Inter Tight',
    fontWeight: '600',
    fontSize: 15,
    color: '#9BA4FF',
  },

  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  balanceLabel: {
    width: 90,
    fontFamily: 'Cormorant Infant',
    color: '#FFFFFF',
  },
  balanceBarBackground: {
    flex: 1,
    height: 10,
    backgroundColor: '#1A1F3C',
    borderRadius: 6,
    overflow: 'hidden',
    marginHorizontal: 10,
  },
  balanceBar: {
    height: '100%',
    borderRadius: 6,
  },
  balancePercent: {
    width: 40,
    fontFamily: 'Inter Tight',
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'right',
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontFamily: 'Inter Tight',
    fontSize: 16,
    color: '#FFFFFF',
  },
  emptyTitle: {
    fontFamily: 'Cinzel',
    fontWeight: '600',
    fontSize: 20,
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyDescription: {
    fontFamily: 'CormorantInfant',
    fontSize: 16,
    color: '#DADDF7',
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 24,
  },
  checkButton: {
    backgroundColor: '#9BA4FF',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignSelf: 'center',
  },
  checkButtonText: {
    fontFamily: 'Inter Tight',
    fontWeight: '600',
    fontSize: 16,
    color: '#FFFFFF',
  },
  historyItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2E3570',
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  historyDate: {
    fontFamily: 'Inter Tight',
    fontSize: 14,
    color: '#9BA4FF',
    fontWeight: '500',
  },
  historyTime: {
    fontFamily: 'Inter Tight',
    fontSize: 12,
    color: '#DADDF7',
    fontWeight: '400',
  },
  historyStats: {
    gap: 8,
  },
  historyStatText: {
    fontFamily: 'Inter Tight',
    fontSize: 13,
    color: '#DADDF7',
    fontWeight: '400',
  },
  historyColors: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  historyColorDot: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  colorDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  historyColorCount: {
    fontFamily: 'Inter Tight',
    fontSize: 12,
    color: '#DADDF7',
    fontWeight: '400',
  },
  chakraSubtitle: {
    fontFamily: 'CormorantInfant',
    fontSize: 15,
    color: '#DADDF7',
    marginBottom: 16,
    lineHeight: 22,
  },
  chakraItem: {
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2E3570',
  },
  chakraHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  chakraColorDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  chakraName: {
    fontFamily: 'Cinzel',
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  chakraColorName: {
    fontFamily: 'Inter Tight',
    fontSize: 13,
    color: '#9BA4FF',
    fontWeight: '400',
  },
  chakraAdvice: {
    fontFamily: 'CormorantInfant',
    fontSize: 14,
    color: '#DADDF7',
    lineHeight: 20,
    paddingLeft: 28,
  },
});
