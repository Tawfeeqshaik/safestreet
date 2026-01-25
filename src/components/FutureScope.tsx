import { motion } from 'framer-motion';
import { Smartphone, Wifi, Brain, LayoutDashboard, Globe, ChevronRight } from 'lucide-react';

const futureFeatures = [
  {
    icon: Smartphone,
    title: 'Citizen Reporting App',
    description: 'Allow citizens to report walkability issues in real-time via mobile, with photo upload and GPS location.',
    timeline: 'Phase 1',
  },
  {
    icon: Wifi,
    title: 'Real-Time Data Integration',
    description: 'Connect with IoT sensors for live traffic, lighting status, and crowd density data.',
    timeline: 'Phase 2',
  },
  {
    icon: Brain,
    title: 'AI-Powered Analysis',
    description: 'Use machine learning to predict problem areas and suggest optimal improvement priorities.',
    timeline: 'Phase 2',
  },
  {
    icon: LayoutDashboard,
    title: 'Government Dashboard',
    description: 'Comprehensive analytics dashboard for urban planners with budget allocation tools.',
    timeline: 'Phase 3',
  },
  {
    icon: Globe,
    title: 'Multi-City Expansion',
    description: 'Scale the platform to cover multiple cities, enabling comparative analysis and best practice sharing.',
    timeline: 'Phase 3',
  },
];

export const FutureScope = () => {
  return (
    <section className="py-20 bg-secondary/30">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Future Roadmap
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Safe Streets is designed to scale. Here's our vision for expanding impact 
            and functionality.
          </p>
        </motion.div>

        <div className="relative">
          {/* Timeline Line */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-border -translate-x-1/2" />

          <div className="space-y-8">
            {futureFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative flex items-center gap-8 ${
                  index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                }`}
              >
                {/* Card */}
                <div className={`flex-1 ${index % 2 === 0 ? 'lg:text-right' : 'lg:text-left'}`}>
                  <div className="card-elevated p-6 rounded-2xl inline-block text-left w-full lg:max-w-md">
                    <div className={`flex items-start gap-4 ${index % 2 === 0 ? 'lg:flex-row-reverse lg:text-right' : ''}`}>
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <feature.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="text-xs font-semibold text-primary mb-1">{feature.timeline}</div>
                        <h3 className="text-lg font-bold text-foreground mb-2">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Timeline Dot */}
                <div className="hidden lg:flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground z-10">
                  <ChevronRight className="w-5 h-5" />
                </div>

                {/* Spacer */}
                <div className="hidden lg:block flex-1" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
