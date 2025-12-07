
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-neutral-950 text-white selection:bg-orange-500 selection:text-white">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>

      <div className="z-10 text-center space-y-6 max-w-2xl">
        <div className="space-y-2">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter bg-gradient-to-br from-white to-neutral-500 bg-clip-text text-transparent">
            StravaStory
          </h1>
          <p className="text-neutral-400 text-lg md:text-xl">
            Visualize your activities. Share your story.
          </p>
        </div>

        <div className="pt-8">
          <Link href="/api/auth/login">
            <Button size="lg" className="bg-[#fc4c02] hover:bg-[#e34402] text-white font-semibold rounded-full px-8 py-6 text-lg transition-all hover:scale-105 shadow-xl shadow-orange-900/20">
              Connect with Strava <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>

      <footer className="absolute bottom-6 text-neutral-600 text-sm">
        Built for athletes, by athletes.
      </footer>
    </main>
  );
}
