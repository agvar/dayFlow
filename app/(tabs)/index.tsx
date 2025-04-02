import { Picker } from '@react-native-picker/picker';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import DaySelector from '../DaySelector';
import { initializeDatabase, updateDailyActivities } from '../store/slices/activitiesSlice';
import { setSelectedDate } from '../store/slices/dateSlice';
import { AppDispatch, RootState } from '../store/store';
import { ActivityType } from '../types/types';

export default function HomeScreen() {
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
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
        sleepTime: { start: '22:00', end: '06:00' },
        activities: Array.from({ length: 24 }, () => ({ hour: '', activity: '' as ActivityType }))
      }));
    }
    dispatch(setSelectedDate(date));
  }



  const handleActivityChange = (hourIndex: number, activity: ActivityType) => {
    const prevActivities = dailyActivities[memoizedDay]?.activities || Array.from({ length: 24 }, 
      () => ({ hour: '', activity: '' as ActivityType }));
    const newActivities = [...prevActivities];
    newActivities[hourIndex] = { ...newActivities[hourIndex], hour: hourIndex.toString(), activity: activity };
    
    dispatch(updateDailyActivities({
      day: memoizedDay,
      sleepTime: dailyActivities[memoizedDay]?.sleepTime || { start: '22:00', end: '06:00' },
      activities: newActivities
    }));

  }

  const isSleepHour = (hour:string) =>{
    const sleepTime = dailyActivities[memoizedDay]?.sleepTime || {start:'22:00',end:'06:00'};
    const hourInt = parseInt(hour.split(':')[0]);
    const sleepTimeStart =parseInt(sleepTime.start.split(':')[0]);
    const sleepTimeEnd =parseInt(sleepTime.end.split(':')[0]);
    if(sleepTimeStart <= sleepTimeEnd){
      return hourInt >= sleepTimeStart && hourInt <= sleepTimeEnd;
    }
    else {
      return hourInt <= sleepTimeEnd;
    }
  }
  return (
    <ScrollView style={styles.container}>
      <DaySelector />
      <Text style={styles.header}>My Schedule</Text>
      <Text style={styles.subHeader}>{selectedDate.toLocaleString('en-US', { weekday: 'long' })}, {selectedDate.toLocaleString('en-US', { month: 'long' })} {selectedDate.getDate()}</Text>

      {/* Add Activity Section */}
      <View style={styles.activitySection}>
        <View style={styles.card}>
          <Text style={styles.sectionHeader}>Add Activity</Text>
          <View style={styles.timeContainer}>
            <View style={styles.timeItem}>
              <Text style={styles.timeText}>Start Time:</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={startTime}
                  style={styles.picker}
                  onValueChange={(itemValue) => setStartTime(itemValue)}
                >
                  {Array.from({ length: 24 }, (_, i) => (
                    <Picker.Item key={i} label={`${i}:00`} value={i} />
                  ))}
                </Picker>
              </View>
            </View>
            <View style={styles.timeItem}>
              <Text style={styles.timeText}>End Time:</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={endTime}
                  style={styles.picker}
                  onValueChange={(itemValue) => setEndTime(itemValue)}
                >
                  {Array.from({ length: 24 }, (_, i) => (
                    <Picker.Item key={i} label={`${i}:00`} value={i} />
                  ))}
                </Picker>
              </View>
            </View>
            <View style={styles.timeItem}>
              <Text style={styles.timeText}>Duration:</Text>
              <Text style={styles.durationText}>{endTime >= startTime ? endTime - startTime : 24 - startTime + endTime}h</Text>
            </View>
          </View>
          <Text style={styles.activityText}>Activity: Work</Text>
        </View>
      </View>

      {/* Show Activities Listing */}
      <View style={styles.activity}>
        <Text style={styles.time}>9:00 AM</Text>
        <View style={[styles.TimelineCard, { backgroundColor: '#FFF3E0' }]}>
          <Text style={styles.title}>Team Meeting</Text>
          <Text style={styles.subtitle}>1h - Work</Text>
        </View>
      </View>

      <View style={styles.activity}>
        <Text style={styles.time}>10:00 AM</Text>
        <View style={[styles.TimelineCard, { backgroundColor: '#E0F7FA' }]}>
          <Text style={styles.title}>Project Development</Text>
          <Text style={styles.subtitle}>2h - Work</Text>
        </View>
      </View>

      {/* Add more activities similarly */}



      {/* Quick Add Section */}
      <Text style={styles.sectionHeader}>Quick Add</Text>
      <View style={styles.quickAdd}>
        <Text style={styles.quickAddItem}>Work</Text>
        <Text style={styles.quickAddItem}>Break</Text>
        <Text style={styles.quickAddItem}>Exercise</Text>
        <Text style={styles.quickAddItem}>Study</Text>
      </View>


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
        {(dailyActivities[memoizedDay]?.activities ?? Array.from({length: 24}, () => ({ hour: '', activity: '' as ActivityType }))).map((item, index) => {
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
  container: {
      flex: 1,
      paddingTop: 20,
  },
  scrollView: {
      flex: 1,
      paddingHorizontal: 16,
  },
  titleMain: {
      textAlign: 'center',
      marginBottom: 16,
      marginHorizontal: 16,
      fontSize: 24,
      fontWeight: 'bold',
  },
  titleActivity :{
    marginBottom:16,
    padding :16,
  },
  card: {
      marginBottom: 8,
      marginHorizontal: 16,
  },
  cardContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 8,
      paddingHorizontal: 12,
  },
  hourText: {
      fontSize: 16,
      fontWeight: 'bold',
      minWidth: 60,
  },
  segmentedButtons: {
      width: '70%',
      marginLeft: 8,
  },
  centerContent: {
      justifyContent: 'center',
      alignItems: 'center',
  },
  loadingText: {
      marginTop: 16,
      fontSize: 16,
  },
  errorText: {
      color: 'red',
      fontSize: 16,
      textAlign: 'center',
      padding: 16,
  },
});
*/

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 20 },
  timeContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, paddingHorizontal: 8 },
  timeItem: { flex: 1, marginHorizontal: 4, alignItems: 'center' },
  pickerContainer: { borderWidth: 1, borderColor: '#ccc', borderRadius: 4, overflow: 'hidden', marginTop: 5, width: '100%' },
  picker: { width: '100%', height: 40 },
  timeText: { fontSize: 14, color: '#666', marginBottom: 5, textAlign: 'center' },
  durationText: { fontSize: 14, color: '#666', marginTop: 10, textAlign: 'center' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  subHeader: { fontSize: 16, color: '#666', marginBottom: 24 },
  activitySection: { marginBottom: 24 },
  sectionHeader: { fontSize: 18, fontWeight: '600', marginBottom: 12 },
  card: { borderRadius: 8, padding: 16, elevation: 2, backgroundColor: '#F5F5F5' },
  activityText: { fontSize: 14, color: '#666', marginTop: 4 },
  activityName: { marginTop: 8 },
  time: { width: 80, fontSize: 14, color: 'gray' },
  TimelineCard: { flex: 1, padding: 12, borderRadius: 8, backgroundColor: '#F5F5F5' },
  title: { fontSize: 16, fontWeight: 'bold' },
  activity: { flexDirection: 'row', marginBottom: 16 },
  subtitle: { fontSize: 14, color: 'gray' },
  quickAdd: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 16 },
  quickAddItem: { fontSize: 16, fontWeight: 'bold', color: '#6200EE' },
  loadingText: { marginTop: 16, fontSize: 16 },
  errorText: { color: 'red', fontSize: 16, textAlign: 'center', padding: 16 },
  centerContent: { justifyContent: 'center', alignItems: 'center' }
});