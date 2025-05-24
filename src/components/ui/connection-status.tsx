
import React from 'react';
import { useWebSocket } from '@/contexts/WebSocketContext';
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff, Loader2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export const ConnectionStatus: React.FC<{ className?: string }> = ({ className }) => {
  const { connectionStatus, isConnected } = useWebSocket();

  const getStatusConfig = () => {
    switch (connectionStatus) {
      case 'connected':
        return {
          icon: Wifi,
          text: 'Connected',
          variant: 'default' as const,
          className: 'bg-green-500 hover:bg-green-600',
        };
      case 'connecting':
        return {
          icon: Loader2,
          text: 'Connecting...',
          variant: 'secondary' as const,
          className: 'bg-yellow-500 hover:bg-yellow-600',
        };
      case 'disconnected':
        return {
          icon: WifiOff,
          text: 'Disconnected',
          variant: 'destructive' as const,
          className: '',
        };
      case 'error':
        return {
          icon: AlertCircle,
          text: 'Connection Error',
          variant: 'destructive' as const,
          className: '',
        };
      default:
        return {
          icon: WifiOff,
          text: 'Unknown',
          variant: 'secondary' as const,
          className: '',
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <Badge 
      variant={config.variant}
      className={cn(
        'flex items-center gap-1 text-xs',
        config.className,
        className
      )}
    >
      <Icon 
        className={cn(
          'h-3 w-3',
          connectionStatus === 'connecting' && 'animate-spin'
        )} 
      />
      <span className="hidden sm:inline">{config.text}</span>
    </Badge>
  );
};
