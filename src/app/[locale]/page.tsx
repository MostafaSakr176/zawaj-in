import Advantages from "./_services/components/Advantages";
import Hero from "./_services/components/Hero";
import PlatformStatistics from "./_services/components/PlatformStatistics";
import StackedCards from "./_services/components/StackedCards";

export default function Home() {
  return (
    <main>
      <Hero />
      <PlatformStatistics />
      {/* Cards stacked with GSAP scroll animation */}
      <StackedCards />
    </main>
  );
}
