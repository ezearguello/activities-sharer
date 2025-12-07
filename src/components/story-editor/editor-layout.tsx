
"use client";

import { StravaActivity } from "@/lib/strava";
import { useEditorStore } from "@/store/editor-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { MapLayer } from "./map-layer";
import { StatsOverlay } from "./stats-overlay";
import { Download, ChevronLeft, Map, Activity, Palette, Image as ImageIcon, Trash2 } from "lucide-react";
import Link from "next/link";
import { useCallback, useRef } from "react";
import { toPng } from "html-to-image";

interface EditorLayoutProps {
    activity: StravaActivity;
}

export function EditorLayout({ activity }: EditorLayoutProps) {
    const store = useEditorStore();
    const editorRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDownload = useCallback(async () => {
        if (editorRef.current === null) {
            return;
        }

        try {
            // Needs a small delay to ensure loading if map tiles are fresh
            // In prod better to have a loading state
            const dataUrl = await toPng(editorRef.current, {
                cacheBust: true,
                pixelRatio: 2 // High res
            });

            const link = document.createElement('a');
            link.download = `strava-story-${activity.id}.png`;
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error("Failed to generate image", err);
        }
    }, [activity.id]);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert("Please upload an image file");
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            if (event.target?.result) {
                store.setBackgroundImage(event.target.result as string);
            }
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="flex h-screen bg-neutral-950 text-white overflow-hidden">
            {/* Sidebar Controls */}
            <div className="w-80 border-r border-neutral-800 p-6 flex flex-col gap-6 z-20 bg-neutral-950">
                <div>
                    <Link href="/dashboard" className="flex items-center text-neutral-400 hover:text-white mb-6 transition-colors">
                        <ChevronLeft className="w-4 h-4 mr-1" /> Back to Dashboard
                    </Link>
                    <h2 className="text-xl font-bold">Story Editor</h2>
                    <p className="text-sm text-neutral-500">{activity.name}</p>
                </div>

                <div className="space-y-6 flex-1 overflow-y-auto pr-2">
                    {/* Background Image */}
                    <div className="space-y-3">
                        <div className="flex items-center text-sm font-medium text-neutral-300">
                            <ImageIcon className="w-4 h-4 mr-2" /> Background Image
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleFileUpload}
                            />
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full border-neutral-700 hover:bg-neutral-800 text-neutral-300"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                Upload Photo
                            </Button>
                            {store.backgroundImage && (
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    className="shrink-0"
                                    onClick={() => store.setBackgroundImage(null)}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Map Controls */}
                    {!store.backgroundImage && (
                        <div className="space-y-3">
                            <div className="flex items-center text-sm font-medium text-neutral-300">
                                <Map className="w-4 h-4 mr-2" /> Map Style
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                {['dark', 'light', 'satellite'].map((style) => (
                                    <button
                                        key={style}
                                        onClick={() => store.setMapStyle(style as any)}
                                        className={`text-xs p-2 rounded border capitalize ${store.mapStyle === style
                                            ? 'bg-neutral-800 border-orange-500 text-white'
                                            : 'border-neutral-800 text-neutral-400 hover:bg-neutral-900'
                                            }`}
                                    >
                                        {style}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Polyline Color */}
                    <div className="space-y-3">
                        <div className="flex items-center text-sm font-medium text-neutral-300">
                            <Palette className="w-4 h-4 mr-2" /> Route Color
                        </div>
                        <div className="flex gap-2">
                            {['#fc4c02', '#ffffff', '#00ff00', '#ff00ff', '#3b82f6'].map((color) => (
                                <button
                                    key={color}
                                    onClick={() => store.setPolylineColor(color)}
                                    className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${store.polylineColor === color ? 'border-white' : 'border-transparent'
                                        }`}
                                    style={{ backgroundColor: color }}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Show/Hide Stats */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm font-medium text-neutral-300">
                            <Activity className="w-4 h-4 mr-2" /> Show Stats
                        </div>
                        <Switch
                            checked={store.showStats}
                            onCheckedChange={store.setShowStats}
                        />
                    </div>
                </div>

                <Button
                    onClick={handleDownload}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white gap-2"
                >
                    <Download className="w-4 h-4" /> Download Story
                </Button>
            </div>

            {/* Main Preview Area */}
            <div className="flex-1 flex items-center justify-center bg-neutral-900 p-8">
                {/* 9:16 Container */}
                <div
                    ref={editorRef}
                    className="relative aspect-[9/16] h-full max-h-[90vh] bg-black shadow-2xl overflow-hidden rounded-sm select-none"
                >
                    {/* Background Image Layer */}
                    {store.backgroundImage && (
                        <img
                            src={store.backgroundImage}
                            alt="Background"
                            className="absolute inset-0 w-full h-full object-cover z-0"
                        />
                    )}

                    {/* 1. Map Layer */}
                    <MapLayer summaryPolyline={activity.map.summary_polyline} />

                    {/* 2. Stats Overlay */}
                    <StatsOverlay activity={activity} />

                    {/* Gradient Overlay for text readability */}
                    <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/80 via-transparent to-black/40 z-5" />
                </div>
            </div>
        </div>
    );
}
