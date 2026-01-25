import { motion } from 'framer-motion';
import { Building2, Heart, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

const sdgs = [
  {
    number: 11,
    title: 'Sustainable Cities & Communities',
    icon: Building2,
    color: 'bg-amber-500',
    description: 'Make cities and human settlements inclusive, safe, resilient and sustainable.',
    targets: [
      'Target 11.2: Accessible, safe, affordable transport systems',
      'Target 11.7: Universal access to safe, inclusive public spaces',
    ],
    connection: 'Safe Streets directly supports urban sustainability by improving pedestrian infrastructure, making cities more livable and reducing car dependency.',
  },
  {
    number: 3,
    title: 'Good Health & Well-Being',
    icon: Heart,
    color: 'bg-emerald-500',
    description: 'Ensure healthy lives and promote well-being for all at all ages.',
    targets: [
      'Target 3.6: Halve deaths from road traffic accidents',
      'Target 3.4: Reduce premature mortality from NCDs',
    ],
    connection: 'Walkable streets encourage physical activity, reduce accidents, and improve air quality—all contributing to better public health outcomes.',
  },
];

export const SDGSection = () => {
  return (
    <section id="sdg" className="py-20 bg-background">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            UN Sustainable Development Goals
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Aligned with Global Sustainability
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Safe Streets contributes to the United Nations Sustainable Development Goals, 
            supporting global efforts for a better, more sustainable future.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {sdgs.map((sdg, index) => (
            <motion.div
              key={sdg.number}
              initial={{ opacity: 0, x: index === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="card-elevated rounded-3xl overflow-hidden"
            >
              {/* Header */}
              <div className={`${sdg.color} p-6 text-primary-foreground`}>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-primary-foreground/20 flex items-center justify-center">
                    <span className="text-2xl font-bold">{sdg.number}</span>
                  </div>
                  <div>
                    <div className="text-sm font-medium opacity-90">SDG {sdg.number}</div>
                    <h3 className="text-xl font-bold">{sdg.title}</h3>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <p className="text-muted-foreground">{sdg.description}</p>

                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground text-sm">Relevant Targets:</h4>
                  {sdg.targets.map((target, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2 text-sm text-muted-foreground"
                    >
                      <div className={`w-1.5 h-1.5 rounded-full ${sdg.color} mt-2 flex-shrink-0`} />
                      {target}
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-border">
                  <h4 className="font-semibold text-foreground text-sm mb-2">
                    How Safe Streets Contributes:
                  </h4>
                  <p className="text-sm text-muted-foreground">{sdg.connection}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-12"
        >
          <Button variant="outline" size="lg" asChild>
            <a
              href="https://sdgs.un.org/goals"
              target="_blank"
              rel="noopener noreferrer"
              className="gap-2"
            >
              Learn More About the SDGs
              <ExternalLink className="w-4 h-4" />
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};
