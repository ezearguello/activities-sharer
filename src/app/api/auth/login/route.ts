
import { NextResponse } from "next/server";

export async function GET() {
    const checkEnv = (key: string) => {
        if (!process.env[key]) {
            throw new Error(`Missing environment variable: ${key}`);
        }
        return process.env[key];
    };

    try {
        const clientId = checkEnv("STRAVA_CLIENT_ID");
        const redirectUri = `${checkEnv("NEXT_PUBLIC_BASE_URL")}/api/auth/callback`;
        const scope = "read,activity:read_all";

        const params = new URLSearchParams({
            client_id: clientId!,
            redirect_uri: redirectUri,
            response_type: "code",
            approval_prompt: "auto",
            scope: scope,
        });

        const stravaAuthUrl = `https://www.strava.com/oauth/authorize?${params.toString()}`;

        console.log("--- DEBUG STRAVA AUTH ---");
        console.log("Client ID present:", !!clientId);
        console.log("Client ID length:", clientId?.length);
        console.log("Redirect URI:", redirectUri);
        console.log("Generated URL:", stravaAuthUrl);
        console.log("-------------------------");

        return NextResponse.redirect(stravaAuthUrl);
    } catch (error) {
        console.error("Login setup failed:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
