
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

// Ripple Effect Component
interface RippleProps {
  className?: string;
  duration?: number;
}

export const Ripple: React.FC<RippleProps> = ({ className, duration = 600 }) => {
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);

  const addRipple = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const id = Date.now();

    setRipples(prev => [...prev, { x, y, id }]);

    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== id));
    }, duration);
  };

  return (
    <div
      className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}
      onMouseDown={addRipple}
    >
      {ripples.map(ripple => (
        <motion.div
          key={ripple.id}
          className="absolute bg-white/30 rounded-full"
          style={{
            left: ripple.x,
            top: ripple.y,
          }}
          initial={{ width: 0, height: 0, opacity: 1 }}
          animate={{ 
            width: 200, 
            height: 200, 
            opacity: 0,
            x: -100,
            y: -100
          }}
          transition={{ duration: duration / 1000 }}
        />
      ))}
    </div>
  );
};

// Hover Lift Component
interface HoverLiftProps {
  children: React.ReactNode;
  className?: string;
  liftHeight?: number;
}

export const HoverLift: React.FC<HoverLiftProps> = ({ 
  children, 
  className, 
  liftHeight = 4 
}) => {
  return (
    <motion.div
      className={className}
      whileHover={{ 
        y: -liftHeight,
        transition: { type: "spring", stiffness: 300, damping: 20 }
      }}
      whileTap={{ scale: 0.98 }}
    >
      {children}
    </motion.div>
  );
};

// Magnetic Button Component
interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  magnetStrength?: number;
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({ 
  children, 
  className,
  magnetStrength = 0.3
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = (e.clientX - centerX) * magnetStrength;
    const deltaY = (e.clientY - centerY) * magnetStrength;
    
    setPosition({ x: deltaX, y: deltaY });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={position}
      transition={{ type: "spring", stiffness: 150, damping: 15 }}
    >
      {children}
    </motion.div>
  );
};

// Loading Pulse Component
interface LoadingPulseProps {
  isLoading: boolean;
  children: React.ReactNode;
  className?: string;
}

export const LoadingPulse: React.FC<LoadingPulseProps> = ({ 
  isLoading, 
  children, 
  className 
}) => {
  return (
    <motion.div
      className={className}
      animate={isLoading ? { opacity: [1, 0.6, 1] } : { opacity: 1 }}
      transition={isLoading ? { 
        duration: 1.5, 
        repeat: Infinity, 
        ease: "easeInOut" 
      } : {}}
    >
      {children}
    </motion.div>
  );
};

// Success Animation Component
interface SuccessAnimationProps {
  show: boolean;
  onComplete?: () => void;
  className?: string;
}

export const SuccessAnimation: React.FC<SuccessAnimationProps> = ({ 
  show, 
  onComplete,
  className 
}) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className={cn("absolute inset-0 flex items-center justify-center", className)}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          onAnimationComplete={onComplete}
        >
          <motion.div
            className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            transition={{ duration: 0.6, times: [0, 0.7, 1] }}
          >
            <motion.svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </motion.svg>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
