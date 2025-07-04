import { createContext, useContext, useState } from 'react';
import { ActivityItemRecord, DailyActivitiesRecord } from '../types/types';

interface ActivityContextType {
  dailyActivities: DailyActivitiesRecord; 
  selectedDate: Date;
  isLoading: boolean;
  error: string | null;
  updateDailyActivities: (day: string, activities: ActivityItemRecord) => void;
  setSelectedDate: (date: Date) => void;
  initializeDatabase: () => Promise<void>;
}

const ActivityContext = createContext<ActivityContextType | undefined>(undefined);

export function ActivityProvider({ children }: { children: React.ReactNode }) {
  const [dailyActivities, setDailyActivities] = useState<DailyActivitiesRecord>({}); 
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateDailyActivities = (day: string, activities: ActivityItemRecord) => {
    setDailyActivities(prev => ({
      ...prev,
      [day]: activities
    }));
  };

  const initializeDatabase = async () => {
    setIsLoading(true);
    try {
      // Your database initialization logic here
      setIsLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsLoading(false);
    }
  };

  return (
    <ActivityContext.Provider 
      value={{
        dailyActivities,
        selectedDate,
        isLoading,
        error,
        updateDailyActivities,
        setSelectedDate,
        initializeDatabase
      }}
    >
      {children}
    </ActivityContext.Provider>
  );
}

export function useActivity() {
  const context = useContext(ActivityContext);
  if (context === undefined) {
    throw new Error('useActivity must be used within an ActivityProvider');
  }
  return context;
}