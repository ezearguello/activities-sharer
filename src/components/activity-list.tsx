
"use client";

import { StravaActivity } from "@/lib/strava";
import { ActivityCard } from "./activity-card";

interface ActivityListProps {
    activities: StravaActivity[];
}

export function ActivityList({ activities }: ActivityListProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activities.map((activity) => (
                <ActivityCard
                    key={activity.id}
                    activity={activity}
                    onClick={() => console.log("Selected activity", activity.id)}
                />
            ))}
        </div>
    );
}
