import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { IconButton, Modal, Portal, Text, TextInput, TouchableRipple } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { updateDailyActivities } from '../store/slices/activitiesSlice';
import { AppDispatch } from '../store/store';
import { activityIconsData, ActivityIconType } from './ActivityIcons';

interface AddActivityProps {
  selectedDate: Date;
  dailyActivities: any;
}

export default function AddActivity({ selectedDate, dailyActivities }: AddActivityProps) {
  const [startTime, setStartTime] = useState(6);
  const [endTime, setEndTime] = useState(7);
  const [startPickerVisible, setStartPickerVisible] = useState(false);
  const [endPickerVisible, setEndPickerVisible] = useState(false);
  const [activityName, setActivityName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState<ActivityIconType | null>(null);
  const params = useLocalSearchParams();

  useEffect(() => {
    if (params.name && params.category && params.iconId) {
      setActivityName(params.name as string);
      const icon = activityIconsData.find(i => i.id === params.iconId);
      if (icon) setSelectedIcon(icon);
    }
  }, [params]);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const memoizedDay = selectedDate.toISOString().split('T')[0];

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

  const handleActivityChange = () => {
    if (!selectedIcon || !activityName) return;
    
    const prevActivities = dailyActivities[memoizedDay] || [];
    const newActivities = [...prevActivities];
    
    const formattedStartTime = formatTime(startTime);
    const formattedEndTime = formatTime(endTime);
    
    const newActivity = {
      startTime: formattedStartTime,
      endTime: formattedEndTime,
      activity: activityName,
      category: selectedIcon.id
    };
    
    newActivities.push(newActivity);
    
    dispatch(updateDailyActivities({
      day: memoizedDay,
      activities: newActivities
    }));

    // Reset form and navigate back
    setActivityName('');
    setSelectedIcon(null);
    router.back();
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
      <View style={styles.activityCard}>
        <View style={styles.timeContainer}>
          <View style={styles.timePickerWrapper}>
            <Text style={styles.timeLabel}>Start Time</Text>
            {renderTimePickerButton(true)}
          </View>
          <View style={styles.timePickerWrapper}>
            <Text style={styles.timeLabel}>End Time</Text>
            {renderTimePickerButton(false)}
          </View>
          <View style={styles.durationWrapper}>
            <Text style={styles.timeLabel}>Duration</Text>
            <Text style={styles.durationValue}>{endTime >= startTime ? endTime - startTime : 24 - startTime + endTime}h</Text>
          </View>
        </View>
        {renderTimePickerModal(true)}
        {renderTimePickerModal(false)}
        <Text style={[styles.activityLabel, { marginBottom: 8 }]}>Activity Name</Text>
        <TextInput
          mode="outlined"
          placeholder="What are you working on?"
          placeholderTextColor="#AAAAAA"
          style={[styles.activityInput]}
          outlineStyle={{ borderRadius: 8, borderColor: '#E0E0E0' }}
          value={activityName}
          onChangeText={setActivityName}
          onPressIn={() => router.push('/search-activity')}
        />
        {activityName && (
          <TouchableRipple
            style={styles.addButton}
            onPress={handleActivityChange}
            disabled={!selectedIcon || !activityName}
          >
            <Text style={styles.addButtonText}>Add Activity</Text>
          </TouchableRipple>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  activityCard: { backgroundColor: 'white', borderRadius: 12, padding: 16, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
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
});