
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X, ChevronLeft, ChevronRight, HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Enhanced Tooltip with Rich Content
interface RichTooltipProps {
  title?: string;
  content: React.ReactNode;
  trigger: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  showArrow?: boolean;
  maxWidth?: string;
}

export const RichTooltip: React.FC<RichTooltipProps> = ({
  title,
  content,
  trigger,
  side = 'top',
  showArrow = true,
  maxWidth = 'max-w-xs'
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {trigger}
        </TooltipTrigger>
        <TooltipContent 
          side={side} 
          className={cn("p-0", maxWidth)}
          sideOffset={showArrow ? 8 : 4}
        >
          <Card className="border-0 shadow-lg">
            <CardContent className="p-3">
              {title && (
                <h4 className="font-semibold text-sm mb-2">{title}</h4>
              )}
              <div className="text-sm text-muted-foreground">
                {content}
              </div>
            </CardContent>
          </Card>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

// Interactive Tour Step
interface TourStep {
  id: string;
  target: string; // CSS selector
  title: string;
  content: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  showNext?: boolean;
  showPrev?: boolean;
  showSkip?: boolean;
}

interface TourGuideProps {
  steps: TourStep[];
  isActive: boolean;
  onComplete: () => void;
  onSkip: () => void;
  currentStep?: number;
}

export const TourGuide: React.FC<TourGuideProps> = ({
  steps,
  isActive,
  onComplete,
  onSkip,
  currentStep: externalCurrentStep
}) => {
  const [currentStep, setCurrentStep] = useState(externalCurrentStep || 0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isActive || !steps[currentStep]) {
      setIsVisible(false);
      return;
    }

    const updateTargetPosition = () => {
      const target = document.querySelector(steps[currentStep].target);
      if (target) {
        const rect = target.getBoundingClientRect();
        setTargetRect(rect);
        setIsVisible(true);
        
        // Scroll target into view
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'center'
        });
      }
    };

    // Small delay to ensure DOM is ready
    const timeout = setTimeout(updateTargetPosition, 100);
    
    // Update position on resize
    window.addEventListener('resize', updateTargetPosition);
    window.addEventListener('scroll', updateTargetPosition);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener('resize', updateTargetPosition);
      window.removeEventListener('scroll', updateTargetPosition);
    };
  }, [isActive, currentStep, steps]);

  const goToNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const goToPrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getCurrentStep = () => steps[currentStep];
  const step = getCurrentStep();

  if (!isActive || !isVisible || !targetRect || !step) {
    return null;
  }

  const getTooltipPosition = () => {
    const position = step.position || 'bottom';
    const margin = 20;
    
    switch (position) {
      case 'top':
        return {
          top: targetRect.top - margin,
          left: targetRect.left + targetRect.width / 2,
          transform: 'translate(-50%, -100%)'
        };
      case 'bottom':
        return {
          top: targetRect.bottom + margin,
          left: targetRect.left + targetRect.width / 2,
          transform: 'translate(-50%, 0)'
        };
      case 'left':
        return {
          top: targetRect.top + targetRect.height / 2,
          left: targetRect.left - margin,
          transform: 'translate(-100%, -50%)'
        };
      case 'right':
        return {
          top: targetRect.top + targetRect.height / 2,
          left: targetRect.right + margin,
          transform: 'translate(0, -50%)'
        };
      default:
        return {
          top: targetRect.bottom + margin,
          left: targetRect.left + targetRect.width / 2,
          transform: 'translate(-50%, 0)'
        };
    }
  };

  return (
    <>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 bg-black/50 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={onSkip}
      />
      
      {/* Highlight */}
      <motion.div
        className="fixed border-2 border-blue-500 rounded-lg pointer-events-none z-50"
        style={{
          top: targetRect.top - 4,
          left: targetRect.left - 4,
          width: targetRect.width + 8,
          height: targetRect.height + 8,
        }}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", duration: 0.3 }}
      />

      {/* Tooltip */}
      <motion.div
        className="fixed z-50 max-w-sm"
        style={getTooltipPosition()}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", duration: 0.3, delay: 0.1 }}
      >
        <Card className="shadow-xl border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-semibold text-lg">{step.title}</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={onSkip}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="mb-4 text-sm text-muted-foreground">
              {step.content}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="text-xs text-muted-foreground">
                Step {currentStep + 1} of {steps.length}
              </div>
              
              <div className="flex gap-2">
                {step.showPrev !== false && currentStep > 0 && (
                  <Button variant="outline" size="sm" onClick={goToPrev}>
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>
                )}
                
                {step.showSkip !== false && (
                  <Button variant="outline" size="sm" onClick={onSkip}>
                    Skip Tour
                  </Button>
                )}
                
                {step.showNext !== false && (
                  <Button size="sm" onClick={goToNext}>
                    {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
                    {currentStep < steps.length - 1 && (
                      <ChevronRight className="h-4 w-4 ml-1" />
                    )}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </>
  );
};

// Help Trigger Component
interface HelpTriggerProps {
  title?: string;
  content: React.ReactNode;
  className?: string;
}

export const HelpTrigger: React.FC<HelpTriggerProps> = ({
  title,
  content,
  className
}) => {
  return (
    <RichTooltip
      title={title}
      content={content}
      trigger={
        <Button
          variant="ghost"
          size="sm"
          className={cn("h-5 w-5 p-0 text-muted-foreground hover:text-foreground", className)}
        >
          <HelpCircle className="h-4 w-4" />
        </Button>
      }
    />
  );
};
