
"use client";

import { StravaActivity } from "@/lib/strava";
import { useEditorStore } from "@/store/editor-store";
import { Calendar, Timer, TrendingUp, Zap } from "lucide-react";

interface StatsOverlayProps {
    activity: StravaActivity;
}

export function StatsOverlay({ activity }: StatsOverlayProps) {
    const { showStats } = useEditorStore();

    if (!showStats) return null;

    const distanceKm = (activity.distance / 1000).toFixed(2);
    const elevation = Math.round(activity.total_elevation_gain);

    // Format time HH:MM:SS
    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        return h > 0 ? `${h}h ${m}m` : `${m}m`;
    };

    const timeStr = formatTime(activity.moving_time);

    // Calculate Pace (min/km) for running or Speed (km/h) for cycling
    const isRun = activity.type === 'Run';
    let speedMetric = '';
    let speedLabel = '';

    if (isRun) {
        const paceSeconds = 1000 / activity.average_speed; // sec per km
        const pMin = Math.floor(paceSeconds / 60);
        const pSec = Math.round(paceSeconds % 60);
        speedMetric = `${pMin}:${pSec.toString().padStart(2, '0')}`;
        speedLabel = '/km';
    } else {
        // Speed km/h
        const speedKmh = (activity.average_speed * 3.6).toFixed(1);
        speedMetric = speedKmh;
        speedLabel = 'km/h';
    }

    return (
        <div className="absolute inset-0 z-10 flex flex-col justify-between p-8 pointer-events-none">
            {/* Header */}
            <div className="mt-12 space-y-1">
                <h2 className="text-4xl font-black uppercase italic tracking-tighter drop-shadow-lg text-white">
                    {activity.name}
                </h2>
                <div className="flex items-center text-white/80 font-medium">
                    <Calendar className="w-4 h-4 mr-2" />
                    {new Date(activity.start_date).toLocaleDateString()}
                </div>
            </div>

            {/* Footer Stats Grid */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-6 pt-8 pb-12">
                {/* Distance */}
                <div>
                    <div className="text-sm uppercase tracking-wider text-white/60 mb-1">Distance</div>
                    <div className="text-5xl font-bold text-white tracking-tighter">
                        {distanceKm}<span className="text-2xl ml-1 text-orange-500">km</span>
                    </div>
                </div>

                {/* Elevation */}
                <div>
                    <div className="text-sm uppercase tracking-wider text-white/60 mb-1 flex items-center">
                        <TrendingUp className="w-3 h-3 mr-1" /> Elevation
                    </div>
                    <div className="text-5xl font-bold text-white tracking-tighter">
                        {elevation}<span className="text-2xl ml-1 text-white/60">m</span>
                    </div>
                </div>

                {/* Time */}
                <div>
                    <div className="text-sm uppercase tracking-wider text-white/60 mb-1 flex items-center">
                        <Timer className="w-3 h-3 mr-1" /> Time
                    </div>
                    <div className="text-4xl font-bold text-white tracking-tighter">
                        {timeStr}
                    </div>
                </div>

                {/* Pace/Speed */}
                <div>
                    <div className="text-sm uppercase tracking-wider text-white/60 mb-1 flex items-center">
                        <Zap className="w-3 h-3 mr-1" /> {isRun ? 'Pace' : 'Avg Speed'}
                    </div>
                    <div className="text-4xl font-bold text-white tracking-tighter">
                        {speedMetric}<span className="text-lg ml-1 text-white/60">{speedLabel}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
