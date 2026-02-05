 import { ReactNode } from 'react';
 import { cn } from '@/lib/utils';
 
 interface MapDashboardLayoutProps {
   map: ReactNode;
   dashboard: ReactNode;
   showDashboard?: boolean;
 }
 
 /**
  * CSS Grid layout that ensures map and dashboard NEVER overlap.
  * - Desktop (≥1024px): 2fr 1fr grid with map left, dashboard right
  * - Tablet & Mobile: single column with map on top, dashboard below
  */
 export function MapDashboardLayout({ 
   map, 
   dashboard, 
   showDashboard = false 
 }: MapDashboardLayoutProps) {
   return (
     <div 
       className={cn(
         // Grid layout: NEVER use absolute/fixed positioning
         "grid gap-4 lg:gap-6",
         // Desktop: 2 columns (map 2fr, dashboard 1fr)
         "lg:grid-cols-[2fr_1fr]",
         // Tablet & Mobile: single column, stacked vertically
         "grid-cols-1"
       )}
     >
       {/* Map Container - NEVER absolute/fixed */}
       <div 
         className={cn(
           "rounded-2xl overflow-hidden border border-border shadow-lg",
           // Height constraints to prevent page scroll
           "h-full min-h-[400px] max-h-[70vh]",
           // Ensure proper stacking order
           "relative z-0"
         )}
       >
         {map}
       </div>
 
       {/* Dashboard Container - NEVER absolute/fixed */}
       {showDashboard && (
         <div 
           className={cn(
             "rounded-2xl border border-border bg-card shadow-lg",
             // Height constraints - only dashboard scrolls, not page
             "max-h-[70vh] overflow-y-auto",
             // Proper stacking order (below map overlays like zoom controls)
             "relative z-0"
           )}
         >
           {dashboard}
         </div>
       )}
     </div>
   );
 }