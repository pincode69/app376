import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../_layout';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BackIcon } from '../components/icons/BackIcon';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const SETTINGS_KEYS = {
  MUSIC: 'settings_music',
  SOUNDS: 'settings_sounds',
  VIBRATION: 'settings_vibration',
};

const HISTORY_KEY = '@aura_history';

export default function SettingsScreen() {
  const navigation = useNavigation<NavigationProp>();

  const [musicEnabled, setMusicEnabled] = useState(true);
  const [soundsEnabled, setSoundsEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  /* ---------- Load settings ---------- */
  useEffect(() => {
    let isMounted = true;

    const loadSettings = async () => {
      try {
        const [music, sounds, vibration] = await Promise.all([
          AsyncStorage.getItem(SETTINGS_KEYS.MUSIC),
          AsyncStorage.getItem(SETTINGS_KEYS.SOUNDS),
          AsyncStorage.getItem(SETTINGS_KEYS.VIBRATION),
        ]);

        if (isMounted) {
          if (music !== null) setMusicEnabled(music === 'true');
          if (sounds !== null) setSoundsEnabled(sounds === 'true');
          if (vibration !== null) setVibrationEnabled(vibration === 'true');
          setIsLoading(false);
        }
      } catch (e) {
        console.warn('Failed to load settings', e);
        if (isMounted) setIsLoading(false);
      }
    };

    loadSettings();

    return () => {
      isMounted = false;
    };
  }, []);

  /* ---------- Toggles ---------- */
  const toggleMusic = async (value: boolean) => {
    setMusicEnabled(value);
    await AsyncStorage.setItem(SETTINGS_KEYS.MUSIC, value.toString());
  };

  const toggleSounds = async (value: boolean) => {
    setSoundsEnabled(value);
    await AsyncStorage.setItem(SETTINGS_KEYS.SOUNDS, value.toString());
  };

  const toggleVibration = async (value: boolean) => {
    setVibrationEnabled(value);
    await AsyncStorage.setItem(SETTINGS_KEYS.VIBRATION, value.toString());
  };

  const onClearHistory = () => {
    Alert.alert(
      'Clear History?',
      'Are you sure you want to clear all aura results and meditations? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem(HISTORY_KEY);
              Alert.alert('Success', 'History has been cleared.');
            } catch (e) {
              Alert.alert('Error', 'Failed to clear history.');
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaProvider style={styles.container}>
      <SafeAreaView style={styles.safeContainer}>
        {/* Header with back button */}
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <BackIcon />
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Title */}
          <View style={styles.header}>
            <Text style={styles.title}>Settings</Text>
          </View>

          {/* Content */}
          {!isLoading && (
            <View style={styles.content}>
              {/* Audio */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Audio</Text>

                <SettingRow
                  label="Music"
                  description="Background music"
                  value={musicEnabled}
                  onChange={toggleMusic}
                />

                <SettingRow
                  label="Sounds"
                  description="Sound effects"
                  value={soundsEnabled}
                  onChange={toggleSounds}
                />
              </View>

              {/* Device */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Device</Text>

                <SettingRow
                  label="Vibration"
                  description="Haptic feedback"
                  value={vibrationEnabled}
                  onChange={toggleVibration}
                />
              </View>

              {/* Data */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Data</Text>
                <TouchableOpacity
                  style={styles.dangerButton}
                  activeOpacity={0.85}
                  onPress={onClearHistory}
                >
                  <Text style={styles.dangerButtonText}>Clear History</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

/* ---------- Reusable Row Component ---------- */

type SettingRowProps = {
  label: string;
  description: string;
  value: boolean;
  onChange: (value: boolean) => void;
};

function SettingRow({
  label,
  description,
  value,
  onChange,
}: SettingRowProps) {
  return (
    <View style={styles.settingRow}>
      <View style={styles.settingInfo}>
        <Text style={styles.settingLabel}>{label}</Text>
        <Text style={styles.settingDescription}>{description}</Text>
      </View>

      <View style={styles.switchContainer}>
        <Switch
          value={value}
          onValueChange={onChange}
          trackColor={{ false: 'transparent', true: 'transparent' }}
          thumbColor={value ? '#ead18e' : '#5A6278'}
          ios_backgroundColor="transparent"
        />
      </View>
    </View>
  );
}

/* ---------- Styles ---------- */

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
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    paddingHorizontal: 24,
    marginBottom: 10,
  },
  backButton: {
    padding: 4,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 36,
  },
  title: {
    fontFamily: 'Cinzel',
    fontWeight: '700',
    fontSize: 34,
    color: GOLD,
    letterSpacing: 2.4,
  },
  content: {
    gap: 20,
  },
  section: {
    backgroundColor: CARD_BG,
    borderRadius: 20,
    padding: 26,
    borderWidth: 1,
    borderColor: GOLD,
    shadowColor: GOLD,
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 14,
    elevation: 8,
  },
  sectionTitle: {
    fontFamily: 'Cinzel',
    fontWeight: '600',
    fontSize: 20,
    color: GOLD,
    marginBottom: 20,
    letterSpacing: 1.2,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(234, 209, 142, 0.15)',
  },
  settingInfo: {
    flex: 1,
    marginRight: 20,
  },
  settingLabel: {
    fontFamily: 'Cinzel',
    fontWeight: '600',
    fontSize: 18,
    color: '#FFFFFF',
    letterSpacing: 1.4,
    marginBottom: 6,
  },
  settingDescription: {
    fontFamily: 'Cormorant Infant',
    fontWeight: '400',
    fontSize: 15,
    color: '#DADDF7',
    lineHeight: 22,
  },
  switchContainer: {
    borderWidth: 1,
    borderColor: '#ead18e',
    borderRadius: 20,
    padding: 2,
    backgroundColor: 'transparent',
  },
  dangerButton: {
    marginTop: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(234, 209, 142, 0.4)',
    backgroundColor: 'rgba(234, 209, 142, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dangerButtonText: {
    fontFamily: 'Inter Tight',
    fontWeight: '700',
    fontSize: 15,
    color: '#DADDF7',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
});
