
"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Polyline, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import polyline from "@mapbox/polyline";
import { useEditorStore } from "@/store/editor-store";

interface MapLayerProps {
    summaryPolyline: string;
}

// Component to handle auto-fitting bounds to the activity route
function MapUpdater({ decodedPath }: { decodedPath: [number, number][] }) {
    const map = useMap();
    useEffect(() => {
        if (decodedPath.length > 0) {
            map.fitBounds(decodedPath, { padding: [50, 50] });
        }
    }, [decodedPath, map]);
    return null;
}

export function MapLayer({ summaryPolyline }: MapLayerProps) {
    const { polylineColor, mapStyle, backgroundImage } = useEditorStore();
    const [decodedPath, setDecodedPath] = useState<[number, number][]>([]);

    useEffect(() => {
        if (summaryPolyline) {
            // Decode Strava polyline to [lat, lng][]
            const decoded = polyline.decode(summaryPolyline);
            setDecodedPath(decoded as [number, number][]);
        }
    }, [summaryPolyline]);

    if (!decodedPath.length) return null;

    // Map styles
    const tileUrls = {
        dark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        light: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
        satellite: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    };

    return (
        <div className="absolute inset-0 z-0 text-amber-500">
            <MapContainer
                zoomControl={false}
                attributionControl={false}
                scrollWheelZoom={false}
                doubleClickZoom={false}
                touchZoom={false}
                className="w-full h-full"
                style={{ background: 'transparent' }}
            >
                {!backgroundImage && <TileLayer url={tileUrls[mapStyle]} />}
                <Polyline
                    positions={decodedPath}
                    color={polylineColor}
                    weight={4}
                    opacity={1}
                />
                <MapUpdater decodedPath={decodedPath} />
            </MapContainer>
        </div>
    );
}
