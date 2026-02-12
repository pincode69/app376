import React from 'react';
import {
  Text,
  StyleSheet,
  // ImageBackground,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function AboutScreen() {
  
  return (
    // <ImageBackground
    //   source={require('@assets/images/bg.png')}
    //   style={styles.bg}
    //   resizeMode="cover"
    // >
      <SafeAreaProvider style={styles.container}>
        <SafeAreaView style={styles.safeContainer}>
          <Text>About</Text>
        </SafeAreaView>
      </SafeAreaProvider>
    // </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  safeContainer: {
    flex: 1,
  }
});
