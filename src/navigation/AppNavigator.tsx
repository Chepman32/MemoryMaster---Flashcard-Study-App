import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {SplashScreen} from '../screens/splash/SplashScreen';
import {HomeScreen} from '../screens/home/HomeScreen';
import {StudySessionScreen} from '../screens/study-session/StudySessionScreen';
import {SessionCompleteScreen} from '../screens/study-session/SessionCompleteScreen';
import {DeckDetailsScreen} from '../screens/deck-details/DeckDetailsScreen';
import {DeckEditorScreen} from '../screens/deck-browser/DeckEditorScreen';
import {CardEditorScreen} from '../screens/card-editor/CardEditorScreen';
import {StatisticsScreen} from '../screens/statistics/StatisticsScreen';
import {SettingsScreen} from '../screens/settings/SettingsScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#667EEA',
        tabBarInactiveTintColor: '#718096',
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({color}) => <></>,
        }}
      />
      <Tab.Screen
        name="Statistics"
        component={StatisticsScreen}
        options={{
          tabBarLabel: 'Stats',
          tabBarIcon: ({color}) => <></>,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: ({color}) => <></>,
        }}
      />
    </Tab.Navigator>
  );
};

export const AppNavigator: React.FC = () => {
  const [showSplash, setShowSplash] = React.useState(true);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
        }}>
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="DeckDetails" component={DeckDetailsScreen} />
        <Stack.Screen
          name="DeckEditor"
          component={DeckEditorScreen}
          options={{presentation: 'modal'}}
        />
        <Stack.Screen
          name="CardEditor"
          component={CardEditorScreen}
          options={{presentation: 'modal'}}
        />
        <Stack.Screen
          name="StudySession"
          component={StudySessionScreen}
          options={{presentation: 'fullScreenModal'}}
        />
        <Stack.Screen
          name="SessionComplete"
          component={SessionCompleteScreen}
          options={{presentation: 'modal', gestureEnabled: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
