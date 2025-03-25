
import { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Card, SegmentedButtons, Text, Title } from 'react-native-paper';
import DaySelector from './DaySelector';
import SleepTimeSelector from './SleepTimeSelector';
import { ACTIVITIES, ActivityType, DailyActivitiesRecord, SleepTime } from './types/types';
import { initDatabase, loadDailyActivities, saveDailyActivities } from './utils/database';

export default function HomeScreen() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const memoizedDay = useMemo(() => selectedDate.toISOString().split('T')[0], [selectedDate]);
  const [dailyActivities, setDailyActivities] = useState<DailyActivitiesRecord>(() => {
    return {
      [memoizedDay]: {
        sleepTime: { start: '22:00', end: '06:00' },
        activities: Array.from({length:24}, () => ({ hour: '', activity: '' as ActivityType }))
      }
    };
  });
  
  useEffect(() => {
    const setupDatabase = async () => {
      await initDatabase();
      const savedActivities = await loadDailyActivities(memoizedDay);
      setDailyActivities(savedActivities);
    };
    setupDatabase();
  }, []);

  useEffect(() => {
    const saveActivities = async () => {
      await saveDailyActivities(
        memoizedDay,
        dailyActivities[memoizedDay]?.activities || [],
        dailyActivities[memoizedDay]?.sleepTime || { start: '22:00', end: '06:00' }
      );
    };
    saveActivities();
  }, [dailyActivities, memoizedDay]);

  const handleDayChange=(date:Date)=>{
    if(!dailyActivities[memoizedDay]){
      setDailyActivities((prevState) =>({
        ...prevState,
        [memoizedDay] :{
          sleepTime:{start:'22:00',end:'06:00'},
          activities:Array.from({length:24}, () => ({ hour: '', activity: '' as ActivityType }))
        }
      }))
    }
    setSelectedDate(date);
  }

  const handleSleepTimeChange = (sleepTime:SleepTime) => {
    const start = sleepTime.start
    const end = sleepTime.end
    setDailyActivities((prevState) => ({
      ...prevState,
      [memoizedDay]: {
        sleepTime: { start, end },
        activities: prevState[memoizedDay]?.activities || Array.from({length: 24}, () => ({ hour: '', activity: '' as ActivityType }))
      }
    }));
  }

  const handleActivityChange = (hourIndex: number,activity:ActivityType)=>{
    setDailyActivities((prevState) =>{
      const prevActivities = prevState[memoizedDay]?.activities || Array.from({length:24}, 
        () => ({ hour: '', activity: '' as ActivityType }))
      const newActivities = [...prevActivities]
      newActivities[hourIndex] = {...newActivities[hourIndex],activity };
      return{
        ...prevState,
        [memoizedDay] :{
          sleepTime:prevState[memoizedDay]?.sleepTime || {start:'22:00',end:'06:00'},
          activities :newActivities
        }
      }
    })

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
})


  
