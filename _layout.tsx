import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import MainMenuScreen from './src/screens/MainMenu';
import SettingsScreen from './src/screens/Settings';
import AboutScreen from './src/screens/About';
import MyAuraScreen from './src/screens/MyAuraScreen';
import AuraFlowScreen from './src/screens/AuraFlow';
import UsefulScreen from './src/screens/UsefulScreen';
import ArticleScreen from './src/screens/ArticleScreen';

export type RootStackParamList = {
  mainMenu: undefined;
  myAura: undefined;
  auraFlow: undefined;
  settings: undefined;
  about: undefined;
  useful: undefined;
  article: { articleId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  
  return (
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
          initialRouteName="mainMenu"
        >
          <Stack.Screen name="mainMenu" component={MainMenuScreen} />
          <Stack.Screen name="auraFlow" component={AuraFlowScreen} />
          <Stack.Screen name="settings" component={SettingsScreen} />
          <Stack.Screen name="myAura" component={MyAuraScreen} />
          <Stack.Screen name="about" component={AboutScreen} />
          <Stack.Screen name="useful" component={UsefulScreen} />
          <Stack.Screen name="article" component={ArticleScreen} />
        </Stack.Navigator>
      </NavigationContainer>
  );
}

export default RootNavigator;
