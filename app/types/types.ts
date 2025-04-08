export const ACTIVITIES = ['Play', 'Work', 'Grow'] as const;
export type ActivityType = typeof ACTIVITIES[number];

export interface ActivityItem {
    startTime: string;
    endTime: string;
    activity: string;
    category: string;
}

export type DailyActivitiesRecord = Record<string, ActivityItem[]>;