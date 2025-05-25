
import { useState, useCallback, useRef } from 'react';
import { toast } from 'sonner';

interface OptimisticAction<T> {
  id: string;
  optimisticData: T;
  rollbackData: T;
  promise: Promise<T>;
}

export const useOptimisticUpdates = <T>() => {
  const [pendingActions, setPendingActions] = useState<Map<string, OptimisticAction<T>>>(new Map());
  const actionCounter = useRef(0);

  const executeOptimistic = useCallback(async <R>(
    optimisticUpdate: () => T,
    apiCall: () => Promise<R>,
    rollbackUpdate: (data: T) => void,
    onSuccess?: (result: R) => void,
    onError?: (error: Error) => void
  ) => {
    const actionId = `action_${++actionCounter.current}`;
    
    // Get current state before optimistic update
    const rollbackData = optimisticUpdate();
    
    // Apply optimistic update immediately
    const optimisticData = optimisticUpdate();
    
    const action: OptimisticAction<T> = {
      id: actionId,
      optimisticData,
      rollbackData,
      promise: apiCall()
    };

    setPendingActions(prev => new Map(prev).set(actionId, action));

    try {
      const result = await apiCall();
      
      // Remove from pending actions
      setPendingActions(prev => {
        const newMap = new Map(prev);
        newMap.delete(actionId);
        return newMap;
      });

      onSuccess?.(result);
      return result;
    } catch (error) {
      // Rollback optimistic update
      rollbackUpdate(rollbackData);
      
      // Remove from pending actions
      setPendingActions(prev => {
        const newMap = new Map(prev);
        newMap.delete(actionId);
        return newMap;
      });

      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      toast.error(`Action failed: ${errorMessage}`);
      onError?.(error as Error);
      throw error;
    }
  }, []);

  const isPending = useCallback((actionType?: string) => {
    if (!actionType) return pendingActions.size > 0;
    return Array.from(pendingActions.values()).some(action => 
      action.id.includes(actionType)
    );
  }, [pendingActions]);

  return {
    executeOptimistic,
    isPending,
    pendingActionsCount: pendingActions.size
  };
};
