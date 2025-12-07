"use client";

import { StravaActivity } from "@/lib/strava";
import { ActivityCard } from "./activity-card";
import { useRouter } from "next/navigation";

interface ActivityListProps {
    activities: StravaActivity[];
}

export function ActivityList({ activities }: ActivityListProps) {
    const router = useRouter();

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activities.map((activity) => (
                <ActivityCard
                    key={activity.id}
                    activity={activity}
                    onClick={() => router.push(`/editor/${activity.id}`)}
                />
            ))}
        </div>
    );
}
