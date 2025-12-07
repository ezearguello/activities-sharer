
import { create } from 'zustand';

interface EditorState {
    backgroundColor: string;
    setBackgroundColor: (color: string) => void;

    polylineColor: string;
    setPolylineColor: (color: string) => void;

    showStats: boolean;
    setShowStats: (show: boolean) => void;

    mapStyle: 'dark' | 'light' | 'satellite';
    setMapStyle: (style: 'dark' | 'light' | 'satellite') => void;

    backgroundImage: string | null;
    setBackgroundImage: (image: string | null) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
    backgroundColor: '#000000',
    setBackgroundColor: (color) => set({ backgroundColor: color }),

    polylineColor: '#fc4c02', // Strava Orange
    setPolylineColor: (color) => set({ polylineColor: color }),

    showStats: true,
    setShowStats: (show) => set({ showStats: show }),

    mapStyle: 'dark',
    setMapStyle: (style) => set({ mapStyle: style }),

    backgroundImage: null,
    setBackgroundImage: (image) => set({ backgroundImage: image }),
}));
