import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'index') {
            iconName = 'time-outline'; 
          } else if (route.name === 'summary') {
            iconName = 'stats-chart-outline';
          } else if (route.name === 'categories') {
            iconName = 'grid-outline';
          } else {
            iconName = 'settings-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6200EE',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tabs.Screen name="index" options={{ title: 'Timeline' }} />
      <Tabs.Screen name="summary" options={{ title: 'Summary' }} />
    </Tabs>
  );
}
