export const ACTIVITIES = ['Play', 'Work', 'Grow'] as const;
export type ActivityType = typeof ACTIVITIES[number];

export interface SleepTime{
    start:string,
    end:string
}
export interface ActivityItem {
    hour: string;
    activity: ActivityType;}

export interface SleepActivity {
    sleepTime:{
        start: string,
        end: string,
    },
    activities :ActivityItem[]
}

export type DailyActivitiesRecord = Record<string, SleepActivity>;