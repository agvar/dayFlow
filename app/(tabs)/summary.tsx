import { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Card, IconButton, Modal, Portal, Text } from 'react-native-paper';
import { ActivityItem, ActivityType } from '../types/types';

export default function ActivitySummary() {
  const selectedDate = useSelector((state: RootState) => new Date(state.date.selectedDate));
  const dailyActivities = useSelector((state: RootState) => state.activities.dailyActivities);
  const memoizedDay = selectedDate.toISOString().split('T')[0];
  const activities = dailyActivities[memoizedDay] || [];
  const [selectedActivity, setSelectedActivity] = useState<ActivityItem | null>(null);
  const [visible, setVisible] = useState(false);

  const showModal = (activity: ActivityItem) => {
    setSelectedActivity(activity);
    setVisible(true);
  };

  const hideModal = () => {
    setVisible(false);
    setSelectedActivity(null);
  };

  const getActivityColor = (activity: ActivityType) => {
    switch (activity) {
      case 'Play':
        return '#FFB6C1'; // Light pink
      case 'Work':
        return '#ADD8E6'; // Light blue
      case 'Grow':
        return '#98FB98'; // Light green
      default:
        return '#E0E0E0'; // Light gray
    }
  };

  return (
    <>
      <ScrollView style={styles.container}>
        <Text variant="titleLarge" style={styles.title}>Activity Summary for {memoizedDay}</Text>
        {activities.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Card.Content>
              <Text style={styles.emptyText}>No activities planned for this day.</Text>
              <Text style={styles.emptySubText}>Start by adding some activities in the Plan tab!</Text>
            </Card.Content>
          </Card>
        ) : (
          activities.map((activity, index) => (
            <TouchableOpacity key={index} onPress={() => showModal(activity)}>
              <Card style={[styles.card, { backgroundColor: getActivityColor(activity.activity as ActivityType) }]}>
                <Card.Content style={styles.cardContent}>
                  <Text style={styles.time}>{activity.startTime} - {activity.endTime}</Text>
                  <Text style={styles.activity}>{activity.activity}</Text>
                  <IconButton icon="chevron-right" size={24} />
                </Card.Content>
              </Card>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={styles.modalContent}
        >
          {selectedActivity && (
            <View>
              <View style={styles.modalHeader}>
                <Text variant="headlineMedium">{`${selectedActivity.startTime} - ${selectedActivity.endTime}`}</Text>
                <IconButton icon="close" size={24} onPress={hideModal} />
              </View>
              
              <View style={styles.activitySection}>
                <Text variant="titleMedium">Planned Activity</Text>
                <Card style={[styles.activityCard, { backgroundColor: getActivityColor(selectedActivity.activity) }]}>
                  <Card.Content>
                    <Text variant="headlineSmall">{selectedActivity.activity}</Text>
                  </Card.Content>
                </Card>
              </View>

              <View style={styles.activitySection}>
                <Text variant="titleMedium">Actual Activity</Text>
                <Card style={styles.inputCard}>
                  <Card.Content>
                    <Text>Coming soon: Actual activity tracking</Text>
                  </Card.Content>
                </Card>
              </View>
            </View>
          )}
        </Modal>
      </Portal>
    </>
  );
};

const styles = StyleSheet.create({
  emptyCard: { marginTop: 20, backgroundColor: '#f5f5f5' },
  emptyText: { fontSize: 18, textAlign: 'center', marginBottom: 8 },
  emptySubText: { fontSize: 14, textAlign: 'center', color: '#666' },
  container: { flex: 1, padding: 16 },
  title: { marginBottom: 16, fontWeight: 'bold' },
  card: { marginBottom: 8 },
  cardContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  time: { fontWeight: 'bold', fontSize: 16 },
  activity: { flex: 1, marginLeft: 16, fontSize: 16 },
  modalContent: { backgroundColor: 'white', padding: 20, margin: 20, borderRadius: 8 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  activitySection: { marginBottom: 20 },
  activityCard: { marginTop: 8 },
  inputCard: { marginTop: 8, backgroundColor: '#F5F5F5' }
});