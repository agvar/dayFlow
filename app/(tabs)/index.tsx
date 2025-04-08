import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { IconButton, Modal, Portal, Text, TextInput, TouchableRipple } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import ActivityIcons, { ActivityIconType, activityIconsData } from '../ActivityIcons';
import DaySelector from '../DaySelector';
import { initializeDatabase, updateDailyActivities } from '../store/slices/activitiesSlice';
import { setSelectedDate } from '../store/slices/dateSlice';
import { AppDispatch, RootState } from '../store/store';
import { ActivityType } from '../types/types';

export default function HomeScreen() {
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [startPickerVisible, setStartPickerVisible] = useState(false);
  const [endPickerVisible, setEndPickerVisible] = useState(false);
  const [activityName, setActivityName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState<ActivityIconType | null>(null);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const selectedDate = useSelector((state: RootState) => new Date(state.date.selectedDate));
  const memoizedDay = useMemo(() => selectedDate.toISOString().split('T')[0], [selectedDate]);
  const { dailyActivities, isLoading, error } = useSelector((state: RootState) => state.activities);

  useEffect(() => {
    dispatch(initializeDatabase());
  }, [dispatch]);

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
      dispatch(updateDailyActivities({
        day: memoizedDay,
        activities: Array.from({ length: 24 }, () => ({ hour: '', activity: '' as ActivityType }))
      }));
    }
    dispatch(setSelectedDate(date));
  }



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
    
    // Reset form
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

      {/* Add Activity Section */}
      <View style={styles.activitySection}>
        <View style={styles.activityCard}>
        <View style={styles.activityHeader}>
          <Text style={styles.cardTitle}>Add Activity</Text>
           <Ionicons name="add-circle" size={30} color="#6200ee" />
        </View>

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
          />
          {/* Actvity category */}
          <Text style={[styles.activityLabel, { marginBottom: 8 }]}>Category</Text>
          <ActivityIcons 
            onSelectIcon={setSelectedIcon} 
            selectedIconId={selectedIcon?.id}
          />
          <TouchableRipple
            style={styles.addButton}
            onPress={handleActivityChange}
            disabled={!selectedIcon || !activityName}
          >
            <Text style={styles.addButtonText}>Add Activity</Text>
          </TouchableRipple>
        </View>
      </View>

      {/* Show Activities Listing */}
      <View style={styles.activitySection}>
        <View style={styles.activityCard}>
          <View style={styles.activityHeader}>
            <Text style={styles.cardTitle}>Activity Set</Text>
            <MaterialIcons name="event" size={24} color="#6200ee" />
          </View>
          {dailyActivities[memoizedDay]?.map((activity, index) => (
            <View key={index} style={styles.activity}>
              <Text style={styles.time}>{activity.startTime} - {activity.endTime}</Text>
              <View style={[styles.TimelineCard, { backgroundColor: activityIconsData.find(icon => icon.id === activity.category)?.color + '20' || '#F5F5F5' }]}>
                <Text style={styles.title}>{activity.activity}</Text>
                <Text style={styles.subtitle}>{activityIconsData.find(icon => icon.id === activity.category)?.name || 'Activity'}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
      {/* Add more activities similarly */}





    </ScrollView>
  );

 
  /*
  return (
    <View style={styles.container}>
      <ScrollView>
      <DaySelector />
        <Title style={styles.titleMain}>Daily Activity Tracker</Title>
        <SleepTimeSelector />
        <Text variant="titleMedium" style={styles.titleActivity}>Schedule your Activities</Text>
        {(dailyActivities[memoizedDay] ?? Array.from({length: 24}, () => ({ hour: '', activity: '' as ActivityType }))).map((item, index) => {
          if (!isSleepHour(`${index.toString().padStart(2, '0')}:00`)) {
            return (
              <Card key={index} style={styles.card}>
                <Card.Content style={styles.cardContent}>
                  <Text style={styles.hourText}>{`${index.toString().padStart(2, '0')}:00`}</Text>
                  <SegmentedButtons
                    style={styles.segmentedButtons}
                    value={item.activity}
                    onValueChange={(value) => handleActivityChange(index, value as ActivityType)}
                    buttons={ACTIVITIES.map((activity) => ({
                      value: activity,
                      label: activity,
                    }))}
                  />
                </Card.Content>
              </Card>
            );
          }
          return null;
        })}
      </ScrollView>
    </View>
  );
  */
}


/*
const styles = StyleSheet.create({
  addButton: {
    backgroundColor: '#6200ee',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    alignItems: 'center'
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  },
  container: {flex: 1,paddingTop: 20,  },
  scrollView: {flex: 1,paddingHorizontal: 16,  },
  titleMain: {textAlign: 'center',marginBottom: 16,marginHorizontal: 16,fontSize: 24,fontWeight: 'bold',  },
  titleActivity :{marginBottom:16,padding :16,},
  card: {marginBottom: 8,marginHorizontal: 16,},
  cardContent: {flexDirection: 'row',alignItems: 'center',justifyContent: 'space-between',paddingVertical: 8,paddingHorizontal: 12,  },
  hourText: {fontSize: 16,fontWeight: 'bold',minWidth: 60,  },
  segmentedButtons: {width: '70%',marginLeft: 8,  },
  centerContent: {justifyContent: 'center',alignItems: 'center',  },
  loadingText: {marginTop: 16,fontSize: 16,  },
  errorText: {color: 'red',fontSize: 16,textAlign: 'center',padding: 16,},
});
*/

const styles = StyleSheet.create({
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
  time: { fontSize: 14, color: '#666', marginBottom: 8 },
  TimelineCard: { padding: 16, borderRadius: 8, marginBottom: 8 },
  title: { fontSize: 16, fontWeight: '500', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#666' },
});