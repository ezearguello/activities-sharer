
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getActivities } from "@/lib/strava";
import { ActivityList } from "@/components/activity-list";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function DashboardPage() {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("strava_access_token")?.value;

    if (!accessToken) {
        redirect("/");
    }

    try {
        const activities = await getActivities(accessToken);

        return (
            <div className="min-h-screen bg-neutral-950 text-white p-6">
                <header className="flex justify-between items-center mb-8 max-w-6xl mx-auto">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                            Your Activities
                        </h1>
                        <p className="text-neutral-400 mt-1">Select an activity to create a story</p>
                    </div>
                    <Link href="/">
                        <Button variant="outline" className="border-neutral-800 hover:bg-neutral-800 text-neutral-300">
                            Sign Out
                        </Button>
                    </Link>
                </header>

                <main className="max-w-6xl mx-auto">
                    <ActivityList activities={activities} />
                </main>
            </div>
        );
    } catch (error) {
        console.error("Failed to load activities", error);
        // In a real app, we might want to try refreshing the token here
        // For now, redirect to login if we can't fetch
        redirect("/?error=fetch_failed");
    }
}
