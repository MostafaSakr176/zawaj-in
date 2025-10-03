import Advantages from "./_services/components/Advantages";
import Hero from "./_services/components/Hero";
import PlatformStatistics from "./_services/components/PlatformStatistics";
import StackedCards from "./_services/components/StackedCards";
import Subscriptions from "./_services/components/Subscriptions";
import Testimonials from "./_services/components/Testimonials";

export default function Home() {
  return (
    <main>
      <Hero />
      <PlatformStatistics />
      {/* Cards stacked with GSAP scroll animation */}
      {/* <StackedCards /> */}
      <div className="space-y-16">
        {/* Card 1 */}
        <Advantages />

        {/* Card 2 */}
        <Subscriptions />

        {/* Card 3 */}
        <Testimonials />
      </div>

    </main>
  );
}
