import React, {useEffect} from 'react';
import {StatusBar} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {AppNavigator} from './navigation/AppNavigator';
import {database} from './database/database';
import {useStore} from './store/useStore';

const App: React.FC = () => {
  const {settings} = useStore();

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      await database.init();
      console.log('App initialized successfully');
    } catch (error) {
      console.error('App initialization error:', error);
    }
  };

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <StatusBar barStyle={settings.theme === 'dark' ? 'light-content' : 'dark-content'} />
      <AppNavigator />
    </GestureHandlerRootView>
  );
};

export default App;
