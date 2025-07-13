import { infos } from "@/config/landing";
import BentoGrid from "@/components/sections/bentogrid";
import Features from "@/components/sections/features";
import HeroLanding from "@/components/sections/hero-landing";

export default function IndexPage() {
  return (
    <>
      <HeroLanding />
      <BentoGrid />
      <Features />
    </>
  );
}
