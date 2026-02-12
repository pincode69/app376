import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

type Props = {
  onFinish: () => void;
};

const USER_NAME_KEY = '@aura_user_name';

export default function LaunchScreen({ onFinish }: Props) {
  const [userName, setUserName] = useState('');

  const handleStartFlow = async () => {
    if (userName.trim()) {
      await AsyncStorage.setItem(USER_NAME_KEY, userName.trim());
    }
    await AsyncStorage.setItem('wasOnLaunch', 'true');
    onFinish();
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>

            {/* HEADER */}
            <View style={styles.header}>
              {/* <Text style={styles.appTitle}>MERITKING</Text>
              <Text style={styles.appSubtitle}>Aura Flow</Text> */}
              <Text style={styles.appTitle}>Aura Flow</Text>
            </View>

            {/* CARD */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Awaken Your Aura</Text>
              <Text style={styles.cardDescription}>
                Streams of energy are already flowing.
                Gather pure aura spheres, avoid the dark ones,
                and reveal the true state of your inner power.
              </Text>

              {/* INPUT */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>YOUR NAME</Text>
                <TextInput
                  style={styles.nameInput}
                  placeholder="Enter your name"
                  placeholderTextColor="#7A7A7A"
                  value={userName}
                  onChangeText={setUserName}
                  autoCapitalize="words"
                  autoCorrect={false}
                />
              </View>

              {/* FEATURES */}
              <View style={styles.featuresList}>
                <Feature text="6 Aura Streams — each with unique energy" />
                <Feature text="Pure Aura Spheres — different colors, different meanings" />
                <Feature text="Dark Spheres — avoid or lose balance" />
                <Feature text="Aura Result — discover your dominant aura" />
              </View>
            </View>

            {/* BUTTON */}
            <TouchableOpacity
              style={[
                styles.startButton,
                !userName.trim() && styles.startButtonDisabled,
              ]}
              onPress={handleStartFlow}
              activeOpacity={0.85}
              disabled={!userName.trim()}
            >
              <Text style={styles.startButtonText}>Enter the Flow</Text>
            </TouchableOpacity>

          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

/* ===== SMALL COMPONENT ===== */
function Feature({ text }: { text: string }) {
  return (
    <View style={styles.featureItem}>
      <Text style={styles.featureDot}>●</Text>
      <Text style={styles.featureText}>{text}</Text>
    </View>
  );
}

/* ===== STYLES ===== */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F1224',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },

  /* HEADER */
  header: {
    alignItems: 'center',
    marginBottom: 36,
  },
  appTitle: {
    fontFamily: 'Cinzel',
    fontWeight: '700',
    fontSize: 34,
    color: '#ead18e',
    letterSpacing: 2.4,
  },
  appSubtitle: {
    fontFamily: 'Cormorant Infant',
    fontWeight: '400',
    fontSize: 18,
    color: '#9BA4FF',
    marginTop: 4,
    letterSpacing: 1,
  },

  /* CARD */
  card: {
    backgroundColor: '#11152A',
    borderRadius: 20,
    padding: 26,
    borderWidth: 1,
    borderColor: '#ead18e',
    shadowColor: '#ead18e',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 14,
    elevation: 8,
  },
  cardTitle: {
    fontFamily: 'Cinzel',
    fontWeight: '600',
    fontSize: 20,
    color: '#ead18e',
    marginBottom: 12,
    letterSpacing: 1.2,
  },
  cardDescription: {
    fontFamily: 'Cormorant Infant',
    fontWeight: '400',
    fontSize: 16,
    color: '#DADDF7',
    lineHeight: 24,
    marginBottom: 22,
  },

  /* INPUT */
  inputContainer: {
    marginBottom: 22,
  },
  inputLabel: {
    fontFamily: 'Inter Tight',
    fontWeight: '600',
    fontSize: 12,
    color: '#3A6FF7',
    letterSpacing: 1,
    marginBottom: 6,
  },
  nameInput: {
    backgroundColor: '#0F1224',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#2E3570',
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: 'Inter Tight',
    fontWeight: '500',
    color: '#FFFFFF',
  },

  /* FEATURES */
  featuresList: {
    gap: 14,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureDot: {
    color: '#9B6BFF',
    fontSize: 10,
    marginRight: 10,
  },
  featureText: {
    fontFamily: 'Cormorant Infant',
    fontWeight: '400',
    fontSize: 15,
    color: '#FFFFFF',
    flex: 1,
  },

  /* BUTTON */
  startButton: {
    marginTop: 26,
    backgroundColor: '#3A6FF7',
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: '#3A6FF7',
    shadowOpacity: 0.6,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 14,
    elevation: 8,
  },
  startButtonDisabled: {
    opacity: 0.5,
  },
  startButtonText: {
    fontFamily: 'Inter Tight',
    fontWeight: '700',
    fontSize: 15,
    color: '#FFFFFF',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
});
