import React, { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeScreen from './src/screens/HomeScreen';
import BoardScreen from './src/screens/BoardScreen';

type Screen = 'home' | 'board';
type Mode = 'ai' | 'local';

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [mode, setMode] = useState<Mode>('ai');
  const [player1Name, setPlayer1Name] = useState('Joueur 1');
  const [player2Name, setPlayer2Name] = useState('Joueur 2');

  if (screen === 'board') {
    return (
      <SafeAreaProvider>
        <BoardScreen
          mode={mode}
          player1Name={player1Name}
          player2Name={player2Name}
          onBack={() => setScreen('home')}
        />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <HomeScreen
        onNavigate={(selectedMode, firstName, secondName) => {
          setMode(selectedMode);
          setPlayer1Name(firstName);
          setPlayer2Name(secondName);
          setScreen('board');
        }}
      />
    </SafeAreaProvider>
  );
}
