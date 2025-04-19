import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Text, TextInput, TouchableRipple } from 'react-native-paper';
import { activityIconsData } from './components/ActivityIcons';

export default function SearchActivityScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const filteredActivities = activityIconsData.filter(
    (activity) =>
      activity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (activity.category?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
  );

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Select Activity',
          headerShadowVisible: false,
          headerStyle: { backgroundColor: '#fff' },
        }}
      />
      <TextInput
        mode="outlined"
        placeholder="Search activities..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={styles.searchInput}
        outlineStyle={{ borderRadius: 8 }}
      />
      <ScrollView style={styles.activityList}>
        {filteredActivities.map((activity) => (
          <TouchableRipple
            key={activity.id}
            onPress={() => {
              router.back();
              router.setParams({
                name: activity.name,
                category: activity.category,
                iconId: activity.id,
              });
            }}
            style={styles.activityItem}
          >
            <View style={styles.activityItemContent}>
              <View style={styles.iconContainer}>{activity.component}</View>
              <View style={styles.activityInfo}>
                <Text style={styles.activityName}>{activity.name}</Text>
                {activity.category && (
                  <Text style={styles.categoryText}>{activity.category}</Text>
                )}
              </View>
              <MaterialIcons name="chevron-right" size={24} color="#C7C7CC" />
            </View>
          </TouchableRipple>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  searchInput: { margin: 16, backgroundColor: '#F5F5F5' },
  activityList: { flex: 1 },
  activityItem: { padding: 12, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#C6C6C8' },
  activityItemContent: { flexDirection: 'row', alignItems: 'center' },
  iconContainer: { marginRight: 12 },
  activityInfo: { flex: 1 },
  activityName: { fontSize: 17, color: '#000', marginBottom: 2 },
  categoryText: { fontSize: 15, color: '#8E8E93' },
});