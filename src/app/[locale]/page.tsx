'use client';
import dynamic from "next/dynamic";
import Hero from "./_services/components/Hero";
import PlatformStatistics from "./_services/components/PlatformStatistics";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "@/i18n/navigation";

const Advantages = dynamic(() => import("./_services/components/Advantages"), { ssr: false });
const NewSubscribers = dynamic(() => import("./_services/components/NewSubscribers"), { ssr: false });
const Subscriptions = dynamic(() => import("./_services/components/Subscriptions"), { ssr: false });
const Testimonials = dynamic(() => import("./_services/components/Testimonials"), { ssr: false });

export default function Home() {
  const { isAuthenticated } = useAuth();
  const router = useRouter()

  if (isAuthenticated) {
    router.push("/home");
  }
  
  return (
    <main>
      <Hero />
      <PlatformStatistics />
      <div className="space-y-16">
        <Advantages />
        <NewSubscribers />
        <Subscriptions />
        <Testimonials />
      </div>
    </main>
  );
}
