import { motion } from 'framer-motion';
import { 
  Footprints, 
  Lightbulb, 
  PersonStanding, 
  Car, 
  Accessibility,
  CheckCircle,
  AlertCircle,
  AlertTriangle 
} from 'lucide-react';

const scoringFactors = [
  {
    icon: Footprints,
    name: 'Footpath Condition',
    description: 'Quality of walking surface, width, and maintenance',
    scoring: [
      { points: 2, criteria: 'Well-maintained, wide footpath (>1.5m)' },
      { points: 1, criteria: 'Basic footpath with minor issues' },
      { points: 0, criteria: 'No footpath or severely damaged' },
    ],
  },
  {
    icon: Lightbulb,
    name: 'Street Lighting',
    description: 'Adequate illumination for safe evening walking',
    scoring: [
      { points: 2, criteria: 'Well-lit throughout (30m intervals)' },
      { points: 1, criteria: 'Partial lighting with dim areas' },
      { points: 0, criteria: 'No lighting or large dark stretches' },
    ],
  },
  {
    icon: PersonStanding,
    name: 'Pedestrian Crossings',
    description: 'Safe crossing facilities at intersections',
    scoring: [
      { points: 2, criteria: 'Signal-controlled crossings available' },
      { points: 1, criteria: 'Zebra crossings without signals' },
      { points: 0, criteria: 'No designated crossing points' },
    ],
  },
  {
    icon: Car,
    name: 'Traffic Safety',
    description: 'Speed limits, barriers, and vehicle behavior',
    scoring: [
      { points: 2, criteria: 'Low traffic, speed bumps, barriers' },
      { points: 1, criteria: 'Moderate traffic with some controls' },
      { points: 0, criteria: 'High-speed traffic, no separation' },
    ],
  },
  {
    icon: Accessibility,
    name: 'Accessibility',
    description: 'Features for elderly and people with disabilities',
    scoring: [
      { points: 2, criteria: 'Ramps, tactile paving, benches' },
      { points: 1, criteria: 'Basic accessibility features' },
      { points: 0, criteria: 'No accessibility provisions' },
    ],
  },
];

const scoreRanges = [
  {
    range: '8-10',
    label: 'Safe',
    icon: CheckCircle,
    color: 'text-status-safe',
    bgColor: 'bg-status-safe/10',
    description: 'Excellent walkability. Pedestrian-friendly with all essential features.',
  },
  {
    range: '5-7',
    label: 'Moderate',
    icon: AlertCircle,
    color: 'text-status-moderate',
    bgColor: 'bg-status-moderate/10',
    description: 'Acceptable but needs improvements. Some safety concerns exist.',
  },
  {
    range: '0-4',
    label: 'Unsafe',
    icon: AlertTriangle,
    color: 'text-status-unsafe',
    bgColor: 'bg-status-unsafe/10',
    description: 'Priority for improvement. Significant hazards for pedestrians.',
  },
];

export const ScoringSystem = () => {
  return (
    <section id="scoring" className="py-20 bg-background">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Transparent Scoring System
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our walkability scores are based on 5 key factors, each worth 0-2 points. 
            Total score ranges from 0-10, graded for transparency and trust.
          </p>
        </motion.div>

        {/* Score Ranges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16"
        >
          {scoreRanges.map((range, index) => (
            <motion.div
              key={range.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 + index * 0.1 }}
              className={`${range.bgColor} p-6 rounded-2xl border border-border`}
            >
              <div className="flex items-center gap-3 mb-3">
                <range.icon className={`w-8 h-8 ${range.color}`} />
                <div>
                  <div className="text-2xl font-bold text-foreground">{range.range}</div>
                  <div className={`font-semibold ${range.color}`}>{range.label}</div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{range.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Scoring Factors */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <h3 className="text-2xl font-bold text-foreground text-center mb-8">
            Scoring Factors (0-2 Points Each)
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {scoringFactors.map((factor, index) => (
              <motion.div
                key={factor.name}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="card-elevated p-6 rounded-2xl"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <factor.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-lg text-foreground mb-1">{factor.name}</h4>
                    <p className="text-sm text-muted-foreground mb-4">{factor.description}</p>
                    <div className="space-y-2">
                      {factor.scoring.map((item) => (
                        <div
                          key={item.points}
                          className="flex items-center gap-3 text-sm"
                        >
                          <span
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                              item.points === 2
                                ? 'bg-status-safe text-primary-foreground'
                                : item.points === 1
                                ? 'bg-status-moderate text-foreground'
                                : 'bg-status-unsafe text-primary-foreground'
                            }`}
                          >
                            {item.points}
                          </span>
                          <span className="text-muted-foreground">{item.criteria}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
