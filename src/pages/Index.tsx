import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { WalkabilityMap } from '@/components/WalkabilityMap';
import { ScoringSystem } from '@/components/ScoringSystem';
import { ImpactSection } from '@/components/ImpactSection';
import { SDGSection } from '@/components/SDGSection';
import { FutureScope } from '@/components/FutureScope';
import { Footer } from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <WalkabilityMap />
      <ScoringSystem />
      <ImpactSection />
      <SDGSection />
      <FutureScope />
      <Footer />
    </div>
  );
};

export default Index;
