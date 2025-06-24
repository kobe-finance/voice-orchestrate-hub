
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useOnboarding } from '@/hooks/useOnboarding';
import { useNavigate } from 'react-router-dom';
import { X, ArrowRight, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const OnboardingReminder: React.FC = () => {
  const { onboardingStatus, dismissReminder } = useOnboarding();
  const navigate = useNavigate();

  // Don't show if onboarding is completed or reminder doesn't need to be shown
  if (!onboardingStatus || onboardingStatus.isCompleted || !onboardingStatus.needsReminder) {
    return null;
  }

  const handleContinueOnboarding = () => {
    navigate('/onboarding');
  };

  const handleDismissWeek = async () => {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    await dismissReminder(nextWeek);
  };

  const handleDismissMonth = async () => {
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    await dismissReminder(nextMonth);
  };

  const completedCount = onboardingStatus.completedSteps?.length || 0;
  const totalSteps = 5;
  const progressPercentage = (completedCount / totalSteps) * 100;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="mb-6"
      >
        <Card className="border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                
                <div className="flex-1 space-y-2">
                  <h3 className="font-semibold text-amber-900 dark:text-amber-100">
                    Complete Your Setup
                  </h3>
                  <p className="text-sm text-amber-700 dark:text-amber-200">
                    You're {completedCount} of {totalSteps} steps through onboarding. 
                    Complete your setup to unlock all VoiceOrchestrate features.
                  </p>
                  
                  {/* Progress bar */}
                  <div className="w-full bg-amber-200 dark:bg-amber-800 rounded-full h-2">
                    <motion.div
                      className="bg-amber-500 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercentage}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  
                  <div className="flex flex-wrap gap-2 pt-2">
                    <Button
                      onClick={handleContinueOnboarding}
                      size="sm"
                      className="bg-amber-600 hover:bg-amber-700 text-white"
                    >
                      Continue Setup
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                    
                    <Button
                      onClick={handleDismissWeek}
                      variant="outline"
                      size="sm"
                      className="border-amber-300 text-amber-700 hover:bg-amber-100 dark:border-amber-600 dark:text-amber-300"
                    >
                      Remind me in a week
                    </Button>
                    
                    <Button
                      onClick={handleDismissMonth}
                      variant="ghost"
                      size="sm"
                      className="text-amber-600 hover:bg-amber-100 dark:text-amber-400"
                    >
                      Dismiss for a month
                    </Button>
                  </div>
                </div>
              </div>
              
              <Button
                onClick={handleDismissWeek}
                variant="ghost"
                size="sm"
                className="text-amber-500 hover:bg-amber-100 dark:hover:bg-amber-900/30 p-1"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};
