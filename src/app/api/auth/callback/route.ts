
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    if (error || !code) {
        console.error("Auth error or missing code", error);
        return NextResponse.redirect(new URL("/?error=auth_failed", request.url));
    }

    try {
        const clientId = process.env.STRAVA_CLIENT_ID;
        const clientSecret = process.env.STRAVA_CLIENT_SECRET;

        if (!clientId || !clientSecret) {
            throw new Error("Missing Strava credentials");
        }

        const tokenResponse = await fetch("https://www.strava.com/oauth/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                client_id: clientId,
                client_secret: clientSecret,
                code,
                grant_type: "authorization_code",
            }),
        });

        if (!tokenResponse.ok) {
            console.error("Token exchange failed", await tokenResponse.text());
            return NextResponse.redirect(new URL("/?error=token_exchange_failed", request.url));
        }

        const data = await tokenResponse.json();

        // Store tokens in cookies
        const cookieStore = await cookies();

        // Calculate expiry (Strava returns expires_at which is unix timestamp)
        // or expires_in (seconds)
        const expiresIn = data.expires_in; // seconds
        const maxAge = expiresIn;

        cookieStore.set("strava_access_token", data.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: maxAge,
            path: "/",
            sameSite: "lax",
        });

        cookieStore.set("strava_refresh_token", data.refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: "/",
            sameSite: "lax",
        });

        // Store expires_at to know when to refresh
        cookieStore.set("strava_expires_at", data.expires_at.toString(), {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: "/",
            sameSite: "lax",
        });

        return NextResponse.redirect(new URL("/dashboard", request.url));
    } catch (err) {
        console.error("Auth callback error:", err);
        return NextResponse.redirect(new URL("/?error=internal_error", request.url));
    }
}
