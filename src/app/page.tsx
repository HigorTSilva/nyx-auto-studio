import { About } from "@/components/about";
import { BeforeAfter } from "@/components/before-after";
import { Contact } from "@/components/contact";
import { Footer } from "@/components/footer";
import { Gallery } from "@/components/gallery";
import { Hero } from "@/components/hero";
import { MapSection } from "@/components/map-section";
import { Services } from "@/components/services";

export default function Home() {
  return (
    <main>
      <Hero />
      <Services />
      <BeforeAfter />
      <Gallery />
      <About />
      <Contact />
      <MapSection />
      <Footer />
    </main>
  );
}
