import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { WalkScoreCalculator } from '@/components/WalkScoreCalculator';
import { ImpactSection } from '@/components/ImpactSection';
import { Footer } from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <WalkScoreCalculator />
      <ImpactSection />
      <Footer />
    </div>
  );
};

export default Index;
