import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LaunchScreen from './src/screens/Launch';
import RootNavigator from './_layout';

type Props = {
  useRootNavigator: boolean;
};

export default function AppBootstrap({ useRootNavigator }: Props) {
  const [showLaunch, setShowLaunch] = useState<boolean | null>(null);

  useEffect(() => {
    if (!useRootNavigator) {
      setShowLaunch(false);
      return;
    }

    const init = async () => {
      const wasOnLaunch = await AsyncStorage.getItem('wasOnLaunch');
      setShowLaunch(wasOnLaunch !== 'true');
    };

    init();
  }, [useRootNavigator]);

  if (showLaunch === null) return null;

  if (showLaunch) {
    return <LaunchScreen onFinish={() => setShowLaunch(false)} />;
  }

  return <RootNavigator />;
}
