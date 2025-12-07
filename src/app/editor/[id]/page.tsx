
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getActivityById } from "@/lib/strava";
import { EditorLayout } from "@/components/story-editor/editor-layout";

interface EditorPageProps {
    params: Promise<{ id: string }>;
}

export default async function EditorPage({ params }: EditorPageProps) {
    const { id } = await params;
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("strava_access_token")?.value;

    if (!accessToken) {
        redirect("/");
    }

    try {
        const activity = await getActivityById(accessToken, id);

        return <EditorLayout activity={activity} />;
    } catch (error) {
        console.error("Failed to fetch activity", error);
        redirect("/dashboard?error=fetch_failed");
    }
}
