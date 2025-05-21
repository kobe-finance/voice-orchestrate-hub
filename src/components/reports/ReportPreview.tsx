
import React from "react";
import { Report } from "@/types/report";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart as BarChartIcon, LineChart as LineChartIcon, PieChart as PieChartIcon, Table } from "lucide-react";
import { BarChart, LineChart as RechartLine, PieChart as RechartPie, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Bar, Line, Pie, Cell } from "recharts";

interface ReportPreviewProps {
  report: Report;
}

// Mock data for visualizations
const MOCK_DATA = {
  call_metrics: [
    { date: "2023-01", callCount: 203, agent: "Team A", avgDuration: 245 },
    { date: "2023-02", callCount: 258, agent: "Team A", avgDuration: 230 },
    { date: "2023-03", callCount: 306, agent: "Team A", avgDuration: 210 },
    { date: "2023-04", callCount: 275, agent: "Team A", avgDuration: 225 },
    { date: "2023-01", callCount: 156, agent: "Team B", avgDuration: 270 },
    { date: "2023-02", callCount: 187, agent: "Team B", avgDuration: 260 },
    { date: "2023-03", callCount: 203, agent: "Team B", avgDuration: 255 },
    { date: "2023-04", callCount: 236, agent: "Team B", avgDuration: 240 },
  ],
  satisfaction_survey: [
    { rating: "Very Satisfied", count: 458, percentage: 45.8 },
    { rating: "Satisfied", count: 340, percentage: 34.0 },
    { rating: "Neutral", count: 108, percentage: 10.8 },
    { rating: "Dissatisfied", count: 64, percentage: 6.4 },
    { rating: "Very Dissatisfied", count: 30, percentage: 3.0 },
  ],
  agent_performance: [
    { agent: "John D.", callsHandled: 156, avgDuration: 245, satisfactionScore: 4.7 },
    { agent: "Sarah M.", callsHandled: 187, avgDuration: 210, satisfactionScore: 4.5 },
    { agent: "Robert L.", callsHandled: 134, avgDuration: 265, satisfactionScore: 4.2 },
    { agent: "Emily P.", callsHandled: 172, avgDuration: 235, satisfactionScore: 4.8 },
    { agent: "Michael J.", callsHandled: 145, avgDuration: 255, satisfactionScore: 4.4 },
  ],
};

// Colors for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

// Custom label renderer for pie chart
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
  const RADIAN = Math.PI / 180;
  const radius = outerRadius * 1.1;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text 
      x={x} 
      y={y} 
      fill={COLORS[index % COLORS.length]} 
      textAnchor={x > cx ? 'start' : 'end'} 
      dominantBaseline="central"
      fontSize={12}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const ReportPreview: React.FC<ReportPreviewProps> = ({ report }) => {
  const renderVisualizationContent = (visualization: Report["visualizations"][0]) => {
    const { type, dataSource, config } = visualization;
    // Type assertion to ensure dataSource is a valid key of MOCK_DATA
    const data = MOCK_DATA[dataSource as keyof typeof MOCK_DATA] || [];
    
    switch (type) {
      case "bar":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 50,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={config.x || "agent"} angle={-45} textAnchor="end" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey={config.y || "avgDuration"} fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        );
        
      case "line":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <RechartLine
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 50,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={config.x || "date"} angle={-45} textAnchor="end" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey={config.y || "callCount"} stroke="#8884d8" />
            </RechartLine>
          </ResponsiveContainer>
        );
        
      case "pie":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <RechartPie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={100}
            >
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey={config.value || "count"}
                nameKey={config.category || "rating"}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </RechartPie>
          </ResponsiveContainer>
        );
        
      case "table":
        return (
          <div className="border rounded-lg overflow-hidden w-full">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-muted/50">
                <tr>
                  {Object.keys(data[0] || {}).map((key) => (
                    <th 
                      key={key}
                      className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                    >
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-background divide-y divide-border">
                {data.slice(0, 5).map((row, i) => (
                  <tr key={i}>
                    {Object.entries(row).map(([key, value]) => (
                      <td 
                        key={key}
                        className="px-6 py-4 whitespace-nowrap text-sm"
                      >
                        {String(value)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        
      default:
        return (
          <div className="h-64 flex items-center justify-center">
            <p className="text-muted-foreground">Visualization preview not available</p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">{report.name}</h1>
        {report.description && (
          <p className="mt-2 text-muted-foreground">{report.description}</p>
        )}
        <div className="mt-2 text-sm text-muted-foreground">
          Generated on {new Date().toLocaleDateString()}
        </div>
      </div>
      
      {report.visualizations.length === 0 ? (
        <div className="text-center py-12">
          <p>No visualizations to display</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {report.visualizations.map(visualization => (
            <Card key={visualization.id}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>{visualization.title}</CardTitle>
                  <div>
                    {visualization.type === "bar" && <BarChartIcon className="h-5 w-5 text-muted-foreground" />}
                    {visualization.type === "line" && <LineChartIcon className="h-5 w-5 text-muted-foreground" />}
                    {visualization.type === "pie" && <PieChartIcon className="h-5 w-5 text-muted-foreground" />}
                    {visualization.type === "table" && <Table className="h-5 w-5 text-muted-foreground" />}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {renderVisualizationContent(visualization)}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReportPreview;
