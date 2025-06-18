import { Stack } from 'expo-router';
import { View } from 'react-native';
import AddActivity from './components/AddActivity';
import { useActivity } from './context/ActivityContext';

export default function AddActivityScreen() {
  const { selectedDate, dailyActivities } = useActivity();

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen options={{ title: 'Add Activity' }} />
      <AddActivity
        selectedDate={selectedDate}
        dailyActivities={dailyActivities}
      />
    </View>
  );
}