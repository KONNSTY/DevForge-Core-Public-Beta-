import { CapabilitiesSection, ContactSection, LabBanner, PortfolioHero, SelectedWorkSection } from "@/components/portfolio-sections";
import { RecruiterPortfolioSummary } from "@/components/recruiter-portfolio-summary";

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Konstantin Regler",
  jobTitle: "Full-stack Engineer",
  url: "https://reglerproductions.com/",
  sameAs: ["https://github.com/KONNSTY"],
  knowsAbout: ["AI engineering", "Full-stack development", "Software quality", "User experience"],
};

export default function Home() {
  return (
    <div className="portfolio-page mx-auto w-full max-w-7xl px-5 pb-16 pt-8 sm:px-8 sm:pt-12 lg:px-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <PortfolioHero />
      <CapabilitiesSection />
      <SelectedWorkSection />
      <LabBanner />
      <ContactSection />
      <RecruiterPortfolioSummary />
    </div>
  );
}
