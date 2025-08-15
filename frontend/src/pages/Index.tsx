import Header from "@/components/branding/Header";
import Hero from "@/components/sections/Hero";
import NespakIntro from "@/components/sections/NespakIntro";
import ProgramsGrid from "@/components/sections/ProgramsGrid";
import StatsSection from "@/components/sections/StatsSection";
import SectorsSection from "@/components/sections/SectorsSection";
import ClientsMarquee from "@/components/sections/ClientsMarquee";
import ContactFooter from "@/components/sections/ContactFooter";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main>
        <Hero />
        <NespakIntro />
        <ProgramsGrid />
        <StatsSection />
        <SectorsSection />
        <ClientsMarquee />
      </main>
      <ContactFooter />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "NESPAK Digital Learning Platform",
        url: "/",
        sameAs: ["https://nespak.com.pk/"]
      }) }} />
    </div>
  );
};

export default Index;
