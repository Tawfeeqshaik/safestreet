import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Wind, 
  Car, 
  Wallet, 
  Heart, 
  TrendingUp,
  Users,
  Leaf
} from 'lucide-react';

const impacts = [
  {
    icon: ShieldCheck,
    title: 'Reduced Accidents',
    description: 'Safer crossings and better visibility lead to fewer pedestrian injuries and fatalities.',
    stat: '40%',
    statLabel: 'reduction in pedestrian accidents',
  },
  {
    icon: Wind,
    title: 'Lower Pollution',
    description: 'Walkable streets encourage walking over driving, reducing vehicle emissions.',
    stat: '25%',
    statLabel: 'decrease in local emissions',
  },
  {
    icon: Car,
    title: 'Less Congestion',
    description: 'More people walking means fewer cars on the road during peak hours.',
    stat: '15%',
    statLabel: 'traffic reduction',
  },
  {
    icon: Wallet,
    title: 'Lower Transport Costs',
    description: 'Walking saves money on fuel, parking, and public transport fares.',
    stat: '₹3,000',
    statLabel: 'monthly savings per household',
  },
  {
    icon: TrendingUp,
    title: 'Stronger Local Economy',
    description: 'Walkable areas boost retail foot traffic and property values.',
    stat: '20%',
    statLabel: 'increase in local spending',
  },
  {
    icon: Heart,
    title: 'Better Public Health',
    description: 'Regular walking reduces cardiovascular disease, obesity, and mental health issues.',
    stat: '35%',
    statLabel: 'improvement in health outcomes',
  },
];

const beneficiaries = [
  { icon: Users, label: 'Citizens', description: 'Safer daily commutes' },
  { icon: Leaf, label: 'Environment', description: 'Cleaner air and less noise' },
  { icon: TrendingUp, label: 'Local Businesses', description: 'More foot traffic' },
  { icon: ShieldCheck, label: 'City Planners', description: 'Data-driven decisions' },
];

export const ImpactSection = () => {
  return (
    <section id="impact" className="py-20 bg-secondary/30">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            The Impact of Walkable Streets
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Improved walkability creates a cascade of positive effects on safety, health, 
            economy, and environment.
          </p>
        </motion.div>

        {/* Impact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {impacts.map((impact, index) => (
            <motion.div
              key={impact.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="card-elevated p-6 rounded-2xl group hover:scale-[1.02] transition-transform duration-300"
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <impact.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">{impact.title}</h3>
              <p className="text-muted-foreground text-sm mb-4">{impact.description}</p>
              <div className="pt-4 border-t border-border">
                <div className="text-3xl font-bold text-primary">{impact.stat}</div>
                <div className="text-sm text-muted-foreground">{impact.statLabel}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Beneficiaries */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="bg-primary rounded-3xl p-8 sm:p-12"
        >
          <h3 className="text-2xl sm:text-3xl font-bold text-primary-foreground text-center mb-8">
            Who Benefits?
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {beneficiaries.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary-foreground/10 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-8 h-8 text-primary-foreground" />
                </div>
                <h4 className="font-bold text-primary-foreground mb-1">{item.label}</h4>
                <p className="text-sm text-primary-foreground/70">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
