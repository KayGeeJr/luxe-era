import RevealOnScroll from "../components/RevealOnScroll";
import HomeHero from "../components/home/HomeHero";
import HomeMarquee from "../components/home/HomeMarquee";
import HomeFeaturedSets from "../components/home/HomeFeaturedSets";
import HomePopularPieces from "../components/home/HomePopularPieces";
import HomeAbout from "../components/home/HomeAbout";
import HomeNewsletter from "../components/home/HomeNewsletter";

export default function HomePage() {
  return (
    <main className="bg-white">
      <HomeHero />
      <HomeMarquee />
      <RevealOnScroll>
        <HomeFeaturedSets />
      </RevealOnScroll>
      <RevealOnScroll delayMs={120}>
        <HomePopularPieces />
      </RevealOnScroll>
      <RevealOnScroll variant="image">
        <HomeAbout />
      </RevealOnScroll>
      <RevealOnScroll delayMs={160}>
        <HomeNewsletter />
      </RevealOnScroll>
    </main>
  );
}
