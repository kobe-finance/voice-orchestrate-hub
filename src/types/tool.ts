
export interface ToolParameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  description: string;
  required: boolean;
  defaultValue?: any;
  enum?: string[];
  properties?: ToolParameter[]; // For object types
}

export interface ToolDefinition {
  id: string;
  name: string;
  description: string;
  category: 'api' | 'database' | 'crm' | 'email' | 'webhook' | 'calendar' | 'custom';
  parameters: ToolParameter[];
  endpoint?: {
    url: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    headers?: Record<string, string>;
    authentication?: {
      type: 'none' | 'api_key' | 'bearer' | 'basic';
      keyLocation?: 'header' | 'query';
      keyName?: string;
    };
  };
  responseSchema?: ToolParameter[];
  errorHandling: {
    onError: 'retry' | 'fallback' | 'abort' | 'ignore';
    retryCount?: number;
    fallbackValue?: any;
  };
  llmConfig: {
    functionName: string;
    functionDescription: string;
    whenToUse: string;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  usageCount: number;
}

export interface ToolExecution {
  id: string;
  toolId: string;
  status: 'pending' | 'success' | 'error';
  input: Record<string, any>;
  output?: any;
  error?: string;
  executedAt: string;
  duration: number;
}
