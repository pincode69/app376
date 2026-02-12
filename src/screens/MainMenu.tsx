import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  Dimensions,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Svg, Circle } from 'react-native-svg';
import HeaderComponent from '../components/HeaderComponent';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../_layout';
import { useNavigation } from '@react-navigation/native';
import { saveMeditation, formatDuration } from '../utils/meditationHistory';
import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_NAME_KEY = '@aura_user_name';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function MainMenuScreen() {
  const [infoVisible, setInfoVisible] = useState(false);
  const [timerVisible, setTimerVisible] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);

  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    const loadUserName = async () => {
      try {
        const name = await AsyncStorage.getItem(USER_NAME_KEY);
        setUserName(name);
      } catch (error) {
        console.error('Error loading user name:', error);
      }
    };

    loadUserName();
  }, []);

  return (
    <SafeAreaProvider style={styles.container}>
      <SafeAreaView style={styles.safeContainer}>

        {/* HEADER */}
        <HeaderComponent
          title="Meritking Aura Flow"
          showAddBtn={false}
          onAddPress={() => {}}
          leftIcon="i"
          rightIcon="timer"
          onLeftPress={() => setInfoVisible(true)}
          onRightPress={() => setTimerVisible(true)}
        />

        {/* WELCOME MESSAGE */}
        {userName && (
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeText}>
              Welcome, {userName}
            </Text>
          </View>
        )}

        {/* MENU */}
        <View style={styles.menuContainer}>
          <MenuButton
            title="My Aura"
            subtitle="Dominant color and energy balance"
            onPress={() => {
              navigation.navigate('myAura')
            }}
          />

          <MenuButton
            title="Aura Flow"
            subtitle="Determine the current state of your aura"
            onPress={() => {navigation.navigate('auraFlow')}}
          />

          <MenuButton
            title="Useful"
            subtitle="Tips, color meanings, aura balance"
            onPress={() => {
              navigation.navigate('useful')
            }}
          />

          <MenuButton
            title="Settings"
            subtitle="Sound, vibration, data clearing"
            onPress={() => {
              navigation.navigate('settings')
            }}
          />
        </View>

        {/* INFO MODAL */}
        <Modal visible={infoVisible} animationType="fade" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>About the App</Text>
              <Text style={styles.modalText}>
                The aura reflects a person’s inner state — their emotions,
                thoughts, and life energy. It is not static and constantly
                changes in response to experiences, choices, and rhythm of life.

                {'\n\n'}

                Each aura color is connected to energy centers known as chakras.
                Together they form a unified system where balance matters more
                than perfection. When one energy becomes excessive or depleted,
                it may influence clarity, emotional stability, and inner calm.

                {'\n\n'}

                Awareness of your energetic state helps you understand yourself
                more deeply, pause when needed, and restore balance naturally.
                Harmony is not a fixed goal, but a gentle process of alignment
                between action and rest, movement and stillness.

                {'\n\n'}

                By observing these shifts, you gradually learn to listen inward
                and live in greater alignment with your own rhythm.
              </Text>

              <Text
                style={{
                  marginTop: 10,
                  marginBottom: 22,
                  fontSize: 12,
                  color: '#9BA4FF',
                  textAlign: 'center',
                  fontFamily: 'Cormorant Infant',
                  opacity: 0.85,
                }}
              >
                Balance begins with awareness
              </Text>

              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setInfoVisible(false)}
              >
                <Text style={styles.modalButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* TIMER MODAL */}
        <MeditationTimerModal
          visible={timerVisible}
          onClose={() => setTimerVisible(false)}
        />

      </SafeAreaView>
    </SafeAreaProvider>
  );
}

/* ===== MENU BUTTON ===== */
function MenuButton({
  title,
  subtitle,
  onPress,
}: {
  title: string;
  subtitle: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.menuButton} onPress={onPress}>
      <Text style={styles.menuTitle}>{title}</Text>
      <Text style={styles.menuSubtitle}>{subtitle}</Text>
    </TouchableOpacity>
  );
}

/* ===== MEDITATION TIMER MODAL ===== */
function MeditationTimerModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const accumulatedTimeRef = useRef(0);

  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = Date.now();
      intervalRef.current = setInterval(() => {
        if (startTimeRef.current) {
          const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
          setSeconds(accumulatedTimeRef.current + elapsed);
        }
      }, 100);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (startTimeRef.current) {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        accumulatedTimeRef.current += elapsed;
        startTimeRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  const handleStart = () => {
    setIsRunning(true);
  };

  const handleStop = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setSeconds(0);
    accumulatedTimeRef.current = 0;
    startTimeRef.current = null;
  };

  const handleClose = async () => {
    if (seconds > 0 && !isRunning) {
      await saveMeditation(seconds);
    }
    handleReset();
    onClose();
  };

  const CIRCLE_SIZE = 200;
  const STROKE_WIDTH = 8;
  const RADIUS = (CIRCLE_SIZE - STROKE_WIDTH) / 2;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
  const maxSeconds = 3600;
  const progress = Math.min(seconds / maxSeconds, 1);
  const strokeDashoffset = CIRCUMFERENCE * (1 - progress);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          <Text style={styles.modalTitle}>Meditation Timer</Text>

          <View style={styles.timerContainer}>
            <Svg width={CIRCLE_SIZE} height={CIRCLE_SIZE} style={styles.timerCircle}>
              <Circle
                cx={CIRCLE_SIZE / 2}
                cy={CIRCLE_SIZE / 2}
                r={RADIUS}
                stroke="#2E3570"
                strokeWidth={STROKE_WIDTH}
                fill="transparent"
              />
              <Circle
                cx={CIRCLE_SIZE / 2}
                cy={CIRCLE_SIZE / 2}
                r={RADIUS}
                stroke="#9BA4FF"
                strokeWidth={STROKE_WIDTH}
                fill="transparent"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                transform={`rotate(-90 ${CIRCLE_SIZE / 2} ${CIRCLE_SIZE / 2})`}
              />
            </Svg>
            <View style={styles.timerTextContainer}>
              <Text style={styles.timerText}>{formatDuration(seconds)}</Text>
            </View>
          </View>

          <View style={styles.timerButtons}>
            {!isRunning ? (
              <TouchableOpacity style={styles.timerButtonStart} onPress={handleStart}>
                <Text style={styles.timerButtonText}>Start</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.timerButtonStop} onPress={handleStop}>
                <Text style={styles.timerButtonText}>Stop</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.modalButtonsRow}>
            <TouchableOpacity style={styles.modalButtonSecondary} onPress={handleReset}>
              <Text style={styles.modalButtonSecondaryText}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={handleClose}>
              <Text style={styles.modalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const GOLD = '#ead18e';
const DARK_BG = '#0F1224';
const CARD_BG = '#11152A';
const BORDER = '#2E3570';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DARK_BG,
  },
  safeContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },

  /* WELCOME */
  welcomeContainer: {
    marginTop: 20,
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  welcomeText: {
    fontFamily: 'Cormorant Infant',
    fontWeight: '400',
    fontSize: 18,
    color: GOLD,
    letterSpacing: 0.8,
  },

  /* MENU */
  menuContainer: {
    marginTop: 28,
    gap: 18,
  },
  menuButton: {
    backgroundColor: CARD_BG,
    borderRadius: 20,
    padding: 22,
    borderWidth: 1,
    borderColor: GOLD,
    shadowColor: GOLD,
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 6,
  },
  menuTitle: {
    fontFamily: 'Cinzel',
    fontWeight: '600',
    fontSize: 18,
    color: GOLD,
    letterSpacing: 1.4,
  },
  menuSubtitle: {
    marginTop: 6,
    fontFamily: 'Cormorant Infant',
    fontWeight: '400',
    fontSize: 15,
    color: '#DADDF7',
    lineHeight: 22,
  },

  /* MODAL */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: CARD_BG,
    borderRadius: 22,
    padding: 26,
    borderWidth: 1,
    borderColor: GOLD,
    shadowColor: GOLD,
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 14,
    elevation: 8,
  },
  modalTitle: {
    fontFamily: 'Cinzel',
    fontWeight: '600',
    fontSize: 20,
    color: GOLD,
    marginBottom: 14,
    letterSpacing: 1.2,
  },
  modalText: {
    fontFamily: 'Cormorant Infant',
    fontWeight: '400',
    fontSize: 16,
    color: '#E6E8FF',
    lineHeight: 24,
    marginBottom: 22,
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 22,
    backgroundColor: GOLD,
    borderRadius: 14,
  },
  modalButtonText: {
    textAlign: 'center',
    fontFamily: 'Inter Tight',
    fontWeight: '700',
    fontSize: 14,
    color: DARK_BG,
    letterSpacing: 1,
  },
  modalButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 10,
  },
  modalButtonSecondary: {
    paddingVertical: 10,
    paddingHorizontal: 22,
    backgroundColor: 'transparent',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: GOLD,
  },
  modalButtonSecondaryText: {
    fontFamily: 'Inter Tight',
    fontWeight: '700',
    fontSize: 14,
    color: GOLD,
    letterSpacing: 1,
  },
  timerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 30,
    position: 'relative',
  },
  timerCircle: {
    position: 'absolute',
  },
  timerTextContainer: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerText: {
    fontFamily: 'Cinzel',
    fontSize: 32,
    fontWeight: '600',
    color: GOLD,
    letterSpacing: 2,
  },
  timerButtons: {
    alignItems: 'center',
    marginBottom: 20,
  },
  timerButtonStart: {
    backgroundColor: GOLD,
    paddingVertical: 14,
    paddingHorizontal: 50,
    borderRadius: 12,
  },
  timerButtonStop: {
    backgroundColor: '#E84C4C',
    paddingVertical: 14,
    paddingHorizontal: 50,
    borderRadius: 12,
  },
  timerButtonText: {
    fontFamily: 'Inter Tight',
    fontWeight: '700',
    fontSize: 16,
    color: DARK_BG,
    letterSpacing: 1,
  },
});
