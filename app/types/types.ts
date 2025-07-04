export const ACTIVITIES = ['Play', 'Work', 'Grow'] as const;
export type ActivityType = typeof ACTIVITIES[number];

export type ActivityItemRecord = Record<string, {
    activity: string;
    category: string;
}>;

export type DailyActivitiesRecord = Record<string, ActivityItemRecord>;