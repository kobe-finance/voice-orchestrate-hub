
interface RateLimitState {
  [key: string]: {
    attempts: number;
    lastAttempt: number;
    lockoutUntil?: number;
  };
}

export const useAuthSecurity = () => {
  const getStorageKey = (type: 'login' | 'register', identifier: string) => {
    return `auth_${type}_${identifier}`;
  };

  const isRateLimited = (type: 'login' | 'register', identifier: string): { 
    isLimited: boolean; 
    remainingTime?: number;
    message?: string;
  } => {
    const key = getStorageKey(type, identifier);
    const stored = localStorage.getItem(key);
    
    if (!stored) {
      return { isLimited: false };
    }
    
    const state: RateLimitState[string] = JSON.parse(stored);
    const now = Date.now();
    
    // Check if in lockout period
    if (state.lockoutUntil && now < state.lockoutUntil) {
      const remainingTime = Math.ceil((state.lockoutUntil - now) / 1000);
      return { 
        isLimited: true, 
        remainingTime,
        message: `Account temporarily locked. Please try again in ${remainingTime} seconds.`
      };
    }
    
    // Check rate limits
    const timeWindow = type === 'login' ? 60000 : 3600000; // 1 min for login, 1 hour for register
    const maxAttempts = type === 'login' ? 5 : 3;
    
    if (now - state.lastAttempt > timeWindow) {
      // Reset counter if outside time window
      return { isLimited: false };
    }
    
    if (state.attempts >= maxAttempts) {
      return { 
        isLimited: true,
        message: `Too many ${type} attempts. Please try again later.`
      };
    }
    
    return { isLimited: false };
  };

  const recordAttempt = (type: 'login' | 'register', identifier: string, success: boolean) => {
    const key = getStorageKey(type, identifier);
    const stored = localStorage.getItem(key);
    const now = Date.now();
    
    let state: RateLimitState[string] = stored ? JSON.parse(stored) : { attempts: 0, lastAttempt: now };
    
    if (success) {
      // Clear on success
      localStorage.removeItem(key);
      return;
    }
    
    // Increment attempts
    state.attempts += 1;
    state.lastAttempt = now;
    
    // Set lockout for repeated failures
    if (type === 'login' && state.attempts >= 5) {
      // Exponential backoff: 5 min, 15 min, 30 min, 1 hour
      const lockoutMinutes = Math.min(60, 5 * Math.pow(2, state.attempts - 5));
      state.lockoutUntil = now + (lockoutMinutes * 60000);
    }
    
    localStorage.setItem(key, JSON.stringify(state));
  };

  const clearAttempts = (type: 'login' | 'register', identifier: string) => {
    const key = getStorageKey(type, identifier);
    localStorage.removeItem(key);
  };

  return {
    isRateLimited,
    recordAttempt,
    clearAttempts
  };
};
