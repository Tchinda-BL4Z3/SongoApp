import React, { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeScreen from './src/screens/HomeScreen';
import BoardScreen from './src/screens/BoardScreen';

type Screen = 'home' | 'board';

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');

  if (screen === 'board') {
    return (
      <SafeAreaProvider>
        <BoardScreen />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <HomeScreen onNavigate={() => setScreen('board')} />
    </SafeAreaProvider>
  );
}
