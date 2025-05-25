
// UI Component Props Types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

// Form Types
export interface FormFieldProps extends BaseComponentProps {
  label: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
}

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

// Table Types
export interface TableColumn<T = any> {
  key: keyof T | string;
  title: string;
  sortable?: boolean;
  width?: string;
  render?: (value: any, record: T, index: number) => React.ReactNode;
}

export interface TableProps<T = any> extends BaseComponentProps {
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  pagination?: PaginationProps;
  onRowClick?: (record: T, index: number) => void;
}

export interface PaginationProps {
  current: number;
  total: number;
  pageSize: number;
  onChange: (page: number, pageSize: number) => void;
}

// Modal Types
export interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

// Navigation Types
export interface NavItem {
  label: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
  children?: NavItem[];
  badge?: string | number;
  disabled?: boolean;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

// Theme Types
export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeConfig {
  mode: ThemeMode;
  primaryColor: string;
  borderRadius: number;
}

// Notification Types
export interface NotificationProps {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  dismissible?: boolean;
}

// Loading States
export interface LoadingState {
  isLoading: boolean;
  error?: string | null;
  data?: any;
}

// Search and Filter Types
export interface SearchFilters {
  query?: string;
  tags?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
  status?: string[];
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Chart Types
export interface ChartDataPoint {
  x: string | number;
  y: number;
  label?: string;
  color?: string;
}

export interface ChartProps extends BaseComponentProps {
  data: ChartDataPoint[];
  type: 'line' | 'bar' | 'pie' | 'area';
  title?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  height?: number;
}
