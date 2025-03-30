
import { useEffect, useMemo } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { Card, SegmentedButtons, Text, Title } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import DaySelector from '../DaySelector';
import SleepTimeSelector from '../SleepTimeSelector';
import { initializeDatabase, updateDailyActivities } from '../store/slices/activitiesSlice';
import { setSelectedDate } from '../store/slices/dateSlice';
import { AppDispatch, RootState } from '../store/store';
import { ACTIVITIES, ActivityType, SleepTime } from '../types/types';

export default function HomeScreen() {
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

  const handleSleepTimeChange = (sleepTime: SleepTime) => {
    dispatch(updateDailyActivities({
      day: memoizedDay,
      sleepTime: { start: sleepTime.start, end: sleepTime.end },
      activities: dailyActivities[memoizedDay]?.activities || Array.from({ length: 24 }, () => ({ hour: '', activity: '' as ActivityType }))
    }));
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
    <View style={styles.container}>
      <ScrollView>
      <DaySelector onDateChange={handleDayChange} />
        <Title style={styles.titleMain}>Daily Activity Tracker</Title>
        <SleepTimeSelector onSleepTimeChange={handleSleepTimeChange} />
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
}

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


  
