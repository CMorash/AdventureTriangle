import Hero from '@/app/components/sections/Hero';
import About from '@/app/components/sections/About';
import Mission from '@/app/components/sections/Mission';
import PartnerCTA from '@/app/components/sections/PartnerCTA';
import PartnerFormSection from '@/app/components/sections/PartnerForm';
import LaunchEvent from '@/app/components/sections/LaunchEvent';
import BetaRegistration from '@/app/components/sections/BetaRegistration';
import Campaign from '@/app/components/sections/Campaign';
import SocialMedia from '@/app/components/sections/SocialMedia';
import Footer from '@/app/components/sections/Footer';
import ContentWrapper from '@/app/components/ui/ContentWrapper';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <ContentWrapper>
        <About />
        <Mission />
        <PartnerCTA />
        <PartnerFormSection />
        <LaunchEvent />
        <BetaRegistration />
        <Campaign />
        <SocialMedia />
        <Footer />
      </ContentWrapper>
    </main>
  );
}
