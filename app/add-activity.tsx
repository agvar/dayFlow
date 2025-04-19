import { Stack } from 'expo-router';
import { View } from 'react-native';
import { useSelector } from 'react-redux';
import AddActivity from './components/AddActivity';
import { RootState } from './store/store';

export default function AddActivityScreen() {
  const selectedDate = useSelector((state: RootState) => new Date(state.date.selectedDate));
  const { dailyActivities } = useSelector((state: RootState) => state.activities);

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