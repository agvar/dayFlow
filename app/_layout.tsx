import { Stack } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { ActivityProvider } from './context/ActivityContext';

export default function RootLayout() {
  return (
    <PaperProvider>
      <ActivityProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </ActivityProvider>
    </PaperProvider>
  );
}