import RevealOnScroll from "../components/RevealOnScroll";
import TrustStrip from "../components/TrustStrip";
import HomeHero from "../components/home/HomeHero";
import HomeMarquee from "../components/home/HomeMarquee";
import HomeFeaturedSets from "../components/home/HomeFeaturedSets";
import HomePopularPieces from "../components/home/HomePopularPieces";
import HomeStory from "../components/home/HomeStory";
import HomeCustomCta from "../components/home/HomeCustomCta";
import HomeNewsletter from "../components/home/HomeNewsletter";

export default function HomePage() {
  return (
    <main className="bg-neutral-950">
      <HomeHero />
      <HomeMarquee />
      <RevealOnScroll>
        <HomeFeaturedSets />
      </RevealOnScroll>
      <RevealOnScroll delayMs={80}>
        <TrustStrip variant="light" />
      </RevealOnScroll>
      <RevealOnScroll delayMs={120}>
        <HomePopularPieces />
      </RevealOnScroll>
      <RevealOnScroll variant="image">
        <HomeStory />
      </RevealOnScroll>
      <RevealOnScroll delayMs={100}>
        <HomeCustomCta />
      </RevealOnScroll>
      <RevealOnScroll delayMs={160}>
        <HomeNewsletter />
      </RevealOnScroll>
    </main>
  );
}
