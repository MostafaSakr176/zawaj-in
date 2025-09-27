
import Advantages from "./_services/components/Advantages";
import Hero from "./_services/components/Hero";
import PlatformStatistics from "./_services/components/PlatformStatistics";
import Subscriptions from "./_services/components/Subscriptions";
import Testimonials from "./_services/components/Testimonials";

export default function Home() {
  return (
    <main>
      <Hero />
      <PlatformStatistics />
      <Advantages />
      <Subscriptions />
      <Testimonials />
    </main>
  );
}
