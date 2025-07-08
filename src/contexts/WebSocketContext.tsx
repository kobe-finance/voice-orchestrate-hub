
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/components/ui/sonner';

interface WebSocketMessage {
  type: string;
  payload: any;
  timestamp: number;
}

interface WebSocketContextType {
  isConnected: boolean;
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
  sendMessage: (message: WebSocketMessage) => void;
  subscribe: (messageType: string, callback: (payload: any) => void) => () => void;
  lastMessage: WebSocketMessage | null;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

// Temporarily disable WebSocket connections since the external service doesn't exist
const WS_ENABLED = false;
const WS_URL = process.env.NODE_ENV === 'production' 
  ? 'wss://api.voiceorchestrate.com/ws' 
  : 'ws://localhost:8080/ws';

export const WebSocketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const [subscribers, setSubscribers] = useState<Map<string, ((payload: any) => void)[]>>(new Map());
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const [reconnectTimer, setReconnectTimer] = useState<NodeJS.Timeout | null>(null);
  
  const { user, session, isAuthenticated } = useAuth();

  const MAX_RECONNECT_ATTEMPTS = 5;
  const RECONNECT_INTERVAL = 3000; // 3 seconds

  const connect = () => {
    // Skip WebSocket connection if disabled
    if (!WS_ENABLED) {
      console.log('WebSocket connections are disabled');
      setConnectionStatus('disconnected');
      return;
    }

    if (!isAuthenticated || !session?.access_token) {
      return;
    }

    setConnectionStatus('connecting');
    
    try {
      const ws = new WebSocket(`${WS_URL}?token=${session.access_token}`);
      
      ws.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        setConnectionStatus('connected');
        setReconnectAttempts(0);
        
        // Send authentication message
        ws.send(JSON.stringify({
          type: 'auth',
          payload: {
            userId: user?.id,
            tenantId: user?.user_metadata?.tenant_id || 'default',
          },
          timestamp: Date.now(),
        }));
      };

      ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          setLastMessage(message);
          
          // Notify subscribers
          const typeSubscribers = subscribers.get(message.type) || [];
          typeSubscribers.forEach(callback => callback(message.payload));
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.onclose = (event) => {
        console.log('WebSocket disconnected:', event.code, event.reason);
        setIsConnected(false);
        setConnectionStatus('disconnected');
        setSocket(null);
        
        // Only attempt reconnection if WebSocket is enabled and not a normal closure
        if (WS_ENABLED && event.code !== 1000 && reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
          const timer = setTimeout(() => {
            setReconnectAttempts(prev => prev + 1);
            connect();
          }, RECONNECT_INTERVAL);
          setReconnectTimer(timer);
        } else if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
          setConnectionStatus('error');
          console.warn('WebSocket connection failed after maximum attempts');
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setConnectionStatus('error');
      };

      setSocket(ws);
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      setConnectionStatus('error');
    }
  };

  const disconnect = () => {
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      setReconnectTimer(null);
    }
    
    if (socket) {
      socket.close(1000, 'User logout');
      setSocket(null);
    }
    
    setIsConnected(false);
    setConnectionStatus('disconnected');
    setReconnectAttempts(0);
  };

  const sendMessage = (message: WebSocketMessage) => {
    if (socket && isConnected) {
      socket.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket not connected. Message not sent:', message);
    }
  };

  const subscribe = (messageType: string, callback: (payload: any) => void) => {
    setSubscribers(prev => {
      const newMap = new Map(prev);
      const typeSubscribers = newMap.get(messageType) || [];
      newMap.set(messageType, [...typeSubscribers, callback]);
      return newMap;
    });

    // Return unsubscribe function
    return () => {
      setSubscribers(prev => {
        const newMap = new Map(prev);
        const typeSubscribers = newMap.get(messageType) || [];
        const filteredSubscribers = typeSubscribers.filter(cb => cb !== callback);
        
        if (filteredSubscribers.length === 0) {
          newMap.delete(messageType);
        } else {
          newMap.set(messageType, filteredSubscribers);
        }
        
        return newMap;
      });
    };
  };

  useEffect(() => {
    if (WS_ENABLED && isAuthenticated && session) {
      connect();
    } else {
      disconnect();
    }

    return () => disconnect();
  }, [isAuthenticated, session]);

  useEffect(() => {
    return () => {
      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
      }
    };
  }, [reconnectTimer]);

  const value: WebSocketContextType = {
    isConnected,
    connectionStatus,
    sendMessage,
    subscribe,
    lastMessage,
  };

  return <WebSocketContext.Provider value={value}>{children}</WebSocketContext.Provider>;
};

export const useWebSocket = (): WebSocketContextType => {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};
