
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type StravaActivity } from "@/lib/strava";
import { Calendar, MapPin, TrendingUp } from "lucide-react";

interface ActivityCardProps {
    activity: StravaActivity;
    onClick?: () => void;
}

export function ActivityCard({ activity, onClick }: ActivityCardProps) {
    const date = new Date(activity.start_date).toLocaleDateString(undefined, {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
    });

    const distanceKm = (activity.distance / 1000).toFixed(2);
    const elevation = Math.round(activity.total_elevation_gain);

    return (
        <Card
            className="cursor-pointer hover:border-orange-500 transition-all hover:shadow-md bg-neutral-900 border-neutral-800 text-neutral-100"
            onClick={onClick}
        >
            <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium leading-none truncate">
                    {activity.name}
                </CardTitle>
                <div className="flex items-center text-sm text-neutral-400 mt-1">
                    <Calendar className="w-3 h-3 mr-1" />
                    {date}
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1 text-orange-500" />
                        <span className="font-bold text-xl">{distanceKm}</span>
                        <span className="text-xs ml-1 text-neutral-500 uppercase">km</span>
                    </div>
                    <div className="flex items-center">
                        <TrendingUp className="w-4 h-4 mr-1 text-blue-500" />
                        <span className="font-bold">{elevation}</span>
                        <span className="text-xs ml-1 text-neutral-500 uppercase">m</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
