
export interface StravaActivity {
    id: number;
    name: string;
    distance: number; // meters
    moving_time: number; // seconds
    elapsed_time: number; // seconds
    total_elevation_gain: number; // meters
    type: string;
    sport_type: string;
    start_date: string;
    start_date_local: string;
    map: {
        id: string;
        summary_polyline: string;
        resource_state: number;
    };
    average_speed: number; // meters/second
    max_speed: number; // meters/second
}

interface TokenResponse {
    access_token: string;
    refresh_token: string;
    expires_at: number;
    expires_in: number;
}

const CLIENT_ID = process.env.STRAVA_CLIENT_ID;
const CLIENT_SECRET = process.env.STRAVA_CLIENT_SECRET;

export async function refreshAccessToken(refreshToken: string): Promise<TokenResponse> {
    const response = await fetch("https://www.strava.com/oauth/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            grant_type: "refresh_token",
            refresh_token: refreshToken,
        }),
    });

    if (!response.ok) {
        throw new Error("Failed to refresh token");
    }

    return response.json();
}

export async function getActivities(accessToken: string, page = 1, perPage = 30): Promise<StravaActivity[]> {
    const response = await fetch(
        `https://www.strava.com/api/v3/athlete/activities?page=${page}&per_page=${perPage}`,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            next: { revalidate: 60 }, // Cache for 60 seconds
        }
    );

    if (!response.ok) {
        throw new Error("Failed to fetch activities");
    }

    return response.json();
}
