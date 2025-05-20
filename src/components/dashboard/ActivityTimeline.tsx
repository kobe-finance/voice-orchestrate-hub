
import React from "react";
import { cn } from "@/lib/utils";

interface ActivityItem {
  id: string;
  time: string;
  title: string;
  description: string;
  type: "call" | "conversion" | "update" | "alert";
}

const activities: ActivityItem[] = [
  {
    id: "1",
    time: "10 min ago",
    title: "Sales Call Completed",
    description: "Lead qualified for demo call",
    type: "call",
  },
  {
    id: "2",
    time: "45 min ago",
    title: "Appointment Booked",
    description: "Demo scheduled for tomorrow at 2PM",
    type: "conversion",
  },
  {
    id: "3",
    time: "2 hours ago",
    title: "Knowledge Base Updated",
    description: "New pricing information added",
    type: "update",
  },
  {
    id: "4",
    time: "4 hours ago",
    title: "High Call Volume Alert",
    description: "Consider adding another agent",
    type: "alert",
  },
];

export const ActivityTimeline: React.FC = () => {
  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex gap-4">
          <div className="flex items-center">
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full",
                activity.type === "call" && "bg-primary/10 text-primary",
                activity.type === "conversion" && "bg-success/10 text-success",
                activity.type === "update" && "bg-info/10 text-info",
                activity.type === "alert" && "bg-warning/10 text-warning"
              )}
            >
              {activity.type === "call" && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              )}
              {activity.type === "conversion" && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
                </svg>
              )}
              {activity.type === "update" && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                  <path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z" />
                  <path d="M9 9h1" />
                  <path d="M9 13h6" />
                  <path d="M9 17h6" />
                </svg>
              )}
              {activity.type === "alert" && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              )}
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">{activity.title}</p>
            <p className="text-sm text-muted-foreground">{activity.description}</p>
            <p className="text-xs text-muted-foreground">{activity.time}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
