
export interface DataSource {
  id: string;
  name: string;
  type: string;
  config?: Record<string, any>;
}

export interface Visualization {
  id: string;
  type: "bar" | "line" | "pie" | "table" | "card" | "scatter";
  title: string;
  dataSource: string;
  config: Record<string, any>;
}

export interface Schedule {
  id: string;
  frequency: "daily" | "weekly" | "monthly";
  time: string;
  recipients: string[];
  format: "pdf" | "excel" | "csv";
}

export interface Report {
  id: string;
  name: string;
  description?: string;
  dataSources: DataSource[];
  visualizations: Visualization[];
  schedules: Schedule[];
  createdAt: string;
  updatedAt: string;
  isTemplate?: boolean;
}

export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  previewVisualizations?: Visualization[];
}
