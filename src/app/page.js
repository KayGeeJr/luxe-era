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
      <HomeFeaturedSets />
      <TrustStrip variant="light" />
      <HomePopularPieces />
      <HomeStory />
      <HomeCustomCta />
      <HomeNewsletter />
    </main>
  );
}
