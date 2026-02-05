import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Footprints, Info, Target, User, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { AuthModal } from './routing/AuthModal';
import { DashboardModal } from './DashboardModal';

const navItems = [
  { name: 'Walk Score', href: '#walk-score', icon: Footprints },
  { name: 'Impact', href: '#impact', icon: Target },
  { name: 'About', href: '#about', icon: Info },
];

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const { user, isAuthenticated, loading } = useAuth();

  const displayName = user?.user_metadata?.display_name || user?.email?.split('@')[0];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="section-container">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <a href="#" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <Footprints className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg text-foreground leading-tight">SafeStreet</span>
                <span className="text-xs text-muted-foreground leading-tight">City Heart</span>
              </div>
            </a>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
                >
                  {item.name}
                </a>
              ))}
            </nav>

            {/* Auth/User Section */}
            <div className="hidden md:flex items-center gap-3">
              {loading ? (
                <div className="w-8 h-8 rounded-full bg-secondary animate-pulse" />
              ) : isAuthenticated ? (
                <button
                  onClick={() => setShowDashboard(true)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-secondary transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-foreground hidden lg:inline">
                    {displayName}
                  </span>
                </button>
              ) : (
                <Button variant="outline" size="sm" onClick={() => setShowAuthModal(true)}>
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              )}
              
              <Button variant="hero" size="lg" asChild>
                <a href="#walk-score">Get SafeStreet Score</a>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-foreground"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-background border-b border-border"
            >
              <div className="section-container py-4 space-y-2">
                {navItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="flex items-center gap-3 px-4 py-3 text-foreground hover:bg-secondary rounded-lg transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <item.icon className="w-5 h-5 text-primary" />
                    {item.name}
                  </a>
                ))}
                
                {/* Mobile Auth */}
                {isAuthenticated ? (
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      setShowDashboard(true);
                    }}
                    className="flex items-center gap-3 px-4 py-3 text-foreground hover:bg-secondary rounded-lg transition-colors w-full"
                  >
                    <User className="w-5 h-5 text-primary" />
                    My Dashboard
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      setShowAuthModal(true);
                    }}
                    className="flex items-center gap-3 px-4 py-3 text-foreground hover:bg-secondary rounded-lg transition-colors w-full"
                  >
                    <LogIn className="w-5 h-5 text-primary" />
                    Sign In
                  </button>
                )}
                
                <Button variant="hero" size="lg" className="w-full mt-4" asChild>
                  <a href="#walk-score" onClick={() => setIsOpen(false)}>Get SafeStreet Score</a>
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Modals */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      <DashboardModal isOpen={showDashboard} onClose={() => setShowDashboard(false)} />
    </>
  );
};
