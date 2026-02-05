 import { motion } from 'framer-motion';
 import { Check, Zap, Crown } from 'lucide-react';
 import { Button } from '@/components/ui/button';
 import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
 import { Badge } from '@/components/ui/badge';
 import { cn } from '@/lib/utils';
 
 const plans = [
   {
     name: 'Free',
     icon: Zap,
     price: '₹0',
     period: 'forever',
     description: 'Perfect for exploring walkability in your neighborhood',
     features: [
       '5 route analyses per day',
       'Basic walkability scores',
       'Report street issues',
       'View community ratings',
       'Earn basic badges',
     ],
     cta: 'Get Started',
     popular: false,
   },
   {
     name: 'Premium',
     icon: Crown,
     price: '₹199',
     period: '/month',
     description: 'For urban explorers and active contributors',
     features: [
       'Unlimited route analyses',
       'Advanced walkability insights',
       'Priority complaint escalation',
       'Historical route data & trends',
       'Exclusive premium badges',
       'Export reports as PDF',
       'Ad-free experience',
     ],
     cta: 'Coming Soon',
     popular: true,
   },
 ];
 
 export function PricingSection() {
   return (
     <section id="pricing" className="py-20 bg-secondary/30">
       <div className="container mx-auto px-4">
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.5 }}
           className="text-center mb-12"
         >
           <Badge variant="outline" className="mb-4">Pricing</Badge>
           <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
             Choose Your Plan
           </h2>
           <p className="text-muted-foreground max-w-2xl mx-auto">
             Start free and upgrade when you need more power. Help us make cities more walkable.
           </p>
         </motion.div>
 
         <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
           {plans.map((plan, index) => (
             <motion.div
               key={plan.name}
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.5, delay: index * 0.1 }}
             >
               <Card
                 className={cn(
                   'relative h-full transition-all duration-300 hover:shadow-lg',
                   plan.popular && 'border-primary shadow-md scale-[1.02]'
                 )}
               >
                 {plan.popular && (
                   <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                     <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
                   </div>
                 )}
                 <CardHeader className="text-center pb-2">
                   <div
                     className={cn(
                       'w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center',
                       plan.popular ? 'bg-primary/10' : 'bg-secondary'
                     )}
                   >
                     <plan.icon
                       className={cn(
                         'w-6 h-6',
                         plan.popular ? 'text-primary' : 'text-muted-foreground'
                       )}
                     />
                   </div>
                   <CardTitle className="text-xl">{plan.name}</CardTitle>
                   <CardDescription>{plan.description}</CardDescription>
                 </CardHeader>
                 <CardContent className="pt-4">
                   <div className="text-center mb-6">
                     <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                     <span className="text-muted-foreground">{plan.period}</span>
                   </div>
 
                   <ul className="space-y-3 mb-6">
                     {plan.features.map((feature) => (
                       <li key={feature} className="flex items-start gap-3">
                         <Check className="w-5 h-5 text-status-safe shrink-0 mt-0.5" />
                         <span className="text-sm text-foreground">{feature}</span>
                       </li>
                     ))}
                   </ul>
 
                   <Button
                     className="w-full"
                     variant={plan.popular ? 'default' : 'outline'}
                     disabled={plan.cta === 'Coming Soon'}
                   >
                     {plan.cta}
                   </Button>
                 </CardContent>
               </Card>
             </motion.div>
           ))}
         </div>
       </div>
     </section>
   );
 }