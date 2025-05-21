
import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardContent } from "@/components/ui/card";

interface RAGPerformanceMetricsProps {
  metrics: {
    latency: number;
    precision: number;
    recall: number;
    f1Score: number;
    queriesPerMinute: number;
  };
}

const RAGPerformanceMetrics: React.FC<RAGPerformanceMetricsProps> = ({ metrics }) => {
  // Transform metrics for chart data
  const chartData = [
    { name: "Precision", value: metrics.precision * 100 },
    { name: "Recall", value: metrics.recall * 100 },
    { name: "F1 Score", value: metrics.f1Score * 100 },
  ];

  // Traffic light color coding based on metric values
  const getMetricColor = (value: number, type: string) => {
    if (type === "latency") {
      if (value < 300) return "text-green-500";
      if (value < 600) return "text-yellow-500";
      return "text-red-500";
    } else {
      if (value > 0.85) return "text-green-500";
      if (value > 0.7) return "text-yellow-500";
      return "text-red-500";
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Performance Metrics</h2>
      <p className="text-muted-foreground">
        Current performance metrics based on the configured settings.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">RESPONSE TIME</h3>
              <p className={`text-4xl font-bold ${getMetricColor(metrics.latency, "latency")}`}>
                {metrics.latency} <span className="text-base">ms</span>
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">QUERIES PER MINUTE</h3>
              <p className="text-4xl font-bold text-primary">
                {metrics.queriesPerMinute} <span className="text-base">qpm</span>
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">F1 SCORE</h3>
              <p className={`text-4xl font-bold ${getMetricColor(metrics.f1Score, "score")}`}>
                {metrics.f1Score.toFixed(2)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-4">Retrieval Quality Metrics</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis 
                  domain={[0, 100]} 
                  label={{ 
                    value: 'Percentage (%)', 
                    angle: -90, 
                    position: 'insideLeft',
                    style: { textAnchor: 'middle' }
                  }} 
                />
                <Tooltip formatter={(value) => [`${value.toFixed(1)}%`, 'Value']} />
                <Legend />
                <Bar 
                  dataKey="value" 
                  name="Score" 
                  fill="#2563EB" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div>
              <h4 className="text-sm font-medium mb-1">Precision</h4>
              <p className="text-sm text-muted-foreground">
                Percentage of retrieved documents that are relevant
              </p>
              <p className={`text-lg font-semibold mt-1 ${getMetricColor(metrics.precision, "score")}`}>
                {(metrics.precision * 100).toFixed(1)}%
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-1">Recall</h4>
              <p className="text-sm text-muted-foreground">
                Percentage of relevant documents that are retrieved
              </p>
              <p className={`text-lg font-semibold mt-1 ${getMetricColor(metrics.recall, "score")}`}>
                {(metrics.recall * 100).toFixed(1)}%
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-1">F1 Score</h4>
              <p className="text-sm text-muted-foreground">
                Harmonic mean of precision and recall
              </p>
              <p className={`text-lg font-semibold mt-1 ${getMetricColor(metrics.f1Score, "score")}`}>
                {(metrics.f1Score * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RAGPerformanceMetrics;
