import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { IconButton, Modal, Portal, Text, TouchableRipple } from 'react-native-paper';
import { ActivityIconType } from '../components/ActivityIcons';
import DaySelector from '../components/DaySelector';
import { useActivity } from '../context/ActivityContext';


export default function HomeScreen() {
  // Local state
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [startPickerVisible, setStartPickerVisible] = useState(false);
  const [endPickerVisible, setEndPickerVisible] = useState(false);
  const [activityName, setActivityName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState<ActivityIconType | null>(null);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  
  // Context
  const { 
    dailyActivities, 
    selectedDate, 
    isLoading, 
    error,
    updateDailyActivities,
    setSelectedDate,
    initializeDatabase 
  } = useActivity();
  
  const memoizedDay = useMemo(() => selectedDate.toISOString().split('T')[0], [selectedDate]);

  // Use DailyActivitiesRecord type for dailyActivities
  const activitiesForDay = dailyActivities[memoizedDay] || {};

  useEffect(() => {
    initializeDatabase();
  }, []);

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Setting up database...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  const handleDayChange = (date: Date) => {
    if (!dailyActivities[memoizedDay]) {
      updateDailyActivities(memoizedDay, []);
    }
    setSelectedDate(date);
  };

  const handleActivityChange = () => {
    if (!selectedIcon || !activityName) return;
    
    const prevActivities = dailyActivities[memoizedDay] || {};
    const newActivities = { ...prevActivities };

    const newActivityKey = `${formatTime(startTime)}-${formatTime(endTime)}`;
    const newActivity = {
      activity: activityName,
      category: selectedIcon.id
    };

    newActivities[newActivityKey] = newActivity;
    updateDailyActivities(memoizedDay, newActivities);

    setActivityName('');
    setSelectedIcon(null);
  }

  const formatTime = (hour: number) => {
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    const period = hour < 12 ? 'AM' : 'PM';
    return `${displayHour}:00 ${period}`;
  };

  const handleTimeSelection = (isStart: boolean, selectedHour: number) => {
    if (isStart) {
      setStartTime(selectedHour);
      setEndTime(Math.max(endTime, (selectedHour + 1) % 24));
    } else {
      if (selectedHour > startTime || (startTime === 23 && selectedHour < startTime)) {
        setEndTime(selectedHour);
      } else {
        setEndTime((startTime + 1) % 24);
      }
    }
    if (isStart) {
      setStartPickerVisible(false);
    } else {
      setEndPickerVisible(false);
    }
  };

  const renderTimePickerModal = (isStart: boolean) => {
    const visible = isStart ? startPickerVisible : endPickerVisible;
    const setVisible = isStart ? setStartPickerVisible : setEndPickerVisible;
    const currentValue = isStart ? startTime : endTime;
    
    return (
      <Portal>
        <Modal
          visible={visible}
          onDismiss={() => setVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select {isStart ? 'Start' : 'End'} Time</Text>
            <IconButton icon="close" size={24} onPress={() => setVisible(false)} />
          </View>
          <ScrollView style={styles.timePickerScrollView}>
            {Array.from({ length: 24 }, (_, i) => (
              <TouchableRipple
                key={i}
                style={[styles.timePickerItem, currentValue === i && styles.selectedTimeItem]}
                onPress={() => handleTimeSelection(isStart, i)}
              >
                <Text style={[styles.timePickerItemText, currentValue === i && styles.selectedTimeText]}>
                  {formatTime(i)}
                </Text>
              </TouchableRipple>
            ))}
          </ScrollView>
        </Modal>
      </Portal>
    );
  };
  
  const renderTimePickerButton = (isStart: boolean) => {
    const currentTime = isStart ? startTime : endTime;
    return (
      <TouchableRipple
        onPress={() => isStart ? setStartPickerVisible(true) : setEndPickerVisible(true)}
        style={styles.timePickerButton}
      >
        <View style={styles.timePickerButtonContent}>
          <Text style={styles.timePickerButtonText}>{formatTime(currentTime)}</Text>
          <MaterialIcons name="arrow-drop-down" size={24} color="#666" />
        </View>
      </TouchableRipple>
    );
  };
  
  return (
    <ScrollView style={styles.container}>
      <DaySelector />
      <Text style={styles.header}>My Day Flow</Text>
      <Text style={styles.subHeader}>{selectedDate.toLocaleString('en-US', { weekday: 'long' })}, {selectedDate.toLocaleString('en-US', { month: 'long' })} {selectedDate.getDate()}</Text>


      {/* Show Activities Listing */}
      <View style={styles.activitySection}>
        <View style={styles.activityCard}>

          {Object.keys(activitiesForDay).length === 0 ? (
            <Text style={styles.noActivityText}>Add activity using the add activity button below</Text>
          ) : (
            <>
              <View style={styles.activityHeader}>
                <Text style={styles.cardTitle}>Activity Set</Text>
                <MaterialIcons name="event" size={24} color="#6200ee" />
              </View>
              {Object.entries(activitiesForDay).map(([timeSlot, activity]) => (
                <View key={timeSlot} style={styles.activity}>
                  <Text>{timeSlot}</Text>
                  <Text>{activity.activity}</Text>
                  <Text>{activity.category}</Text>
                </View>
              ))}
            </>
          )}
        </View>
      </View>
      
      {/* Add Activity Button */}
      <View style={styles.activitySection}>
        <TouchableRipple
          style={styles.addActivityButton}
          onPress={() => router.push('/add-activity')}
        >
          <View style={styles.addActivityButtonContent}>
            <Text style={styles.addActivityButtonText}>Add New Activity</Text>
            <Ionicons name="add-circle" size={24} color="white" />
          </View>
        </TouchableRipple>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  addActivityButton: { backgroundColor: '#6200ee', borderRadius: 12, padding: 16, marginBottom: 16 },
  addActivityButtonContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  addActivityButtonText: { color: 'white', fontSize: 16, fontWeight: '500' },
  container: { flex: 1, padding: 16 },
  centerContent: { justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 16, fontSize: 16, color: '#666' },
  errorText: { color: 'red', fontSize: 16 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  subHeader: { fontSize: 16, color: '#666', marginBottom: 24 },
  activitySection: { marginBottom: 24 },
  activityCard: { backgroundColor: 'white', borderRadius: 12, padding: 16, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  activityHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  cardTitle: { fontSize: 18, fontWeight: 'bold' },
  timeContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  timePickerWrapper: { flex: 1, marginRight: 8 },
  durationWrapper: { flex: 0.5 },
  timeLabel: { fontSize: 12, color: '#666', marginBottom: 4 },
  durationValue: { fontSize: 16, fontWeight: '500', color: '#6200ee' },
  timePickerButton: { backgroundColor: '#F5F5F5', borderRadius: 8, padding: 12 },
  timePickerButtonContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  timePickerButtonText: { fontSize: 16, color: '#333' },
  modalContainer: { backgroundColor: 'white', margin: 20, borderRadius: 12, padding: 16, maxHeight: '80%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 18, fontWeight: 'bold' },
  timePickerScrollView: { maxHeight: 400 },
  timePickerItem: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  selectedTimeItem: { backgroundColor: '#F0F0F0' },
  timePickerItemText: { fontSize: 16, color: '#333' },
  selectedTimeText: { color: '#6200ee', fontWeight: '500' },
  activityLabel: { fontSize: 12, color: '#666' },
  activityInput: { backgroundColor: '#F5F5F5', marginBottom: 16 },
  addButton: { backgroundColor: '#6200ee', borderRadius: 8, padding: 12, alignItems: 'center', marginTop: 8 },
  addButtonText: { color: 'white', fontSize: 16, fontWeight: '500' },
  activity: { marginBottom: 16 },
  activityRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  time: { fontSize: 14, color: '#666', minWidth: 100 },
  TimelineCard: { padding: 16, borderRadius: 8 },
  title: { fontSize: 16, fontWeight: '500', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#666', textAlign: 'center', marginVertical: 16 },
  noActivityText: { fontSize: 14, color: '#666', textAlign: 'center', marginVertical: 16 },
});