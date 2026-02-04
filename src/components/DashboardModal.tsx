import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User } from 'lucide-react';
import { UserDashboard } from './dashboard/UserDashboard';
import { useAuth } from '@/hooks/useAuth';

interface DashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DashboardModal({ isOpen, onClose }: DashboardModalProps) {
  const { user } = useAuth();

  if (!isOpen || !user) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, x: '100%' }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-card shadow-xl z-50 overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold text-foreground">My Dashboard</h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-secondary rounded-lg">
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
          
          <UserDashboard onClose={onClose} />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
