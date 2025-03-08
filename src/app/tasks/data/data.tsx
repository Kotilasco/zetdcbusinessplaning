import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  CheckCircle,
  Circle,
  CircleOff,
  HelpCircle,
  Timer,
} from "lucide-react";

export const labels = [
  {
    value: "overdue",
    label: "Overdue",
  },
  {
    value: "wip",
    label: "work_in_progress",
  },
  {
    value: "completed",
    label: "completed",
  },
];

export const statuses = [
  {
    value: "overdue",
    label: "Backlog",
    icon: HelpCircle,
  },
  {
    value: "pending",
    label: "Pending",
    icon: Circle,
  },
  {
    value: "in_progress",
    label: "In Progress",
    icon: Timer,
  },
  {
    value: "done",
    label: "Done",
    icon: CheckCircle,
  },
  {
    value: "cancelled",
    label: "Cancelled",
    icon: CircleOff,
  },
];

export const priorities = [
  {
    label: "Low",
    value: "low",
    icon: ArrowDown,
  },
  {
    label: "Medium",
    value: "medium",
    icon: ArrowRight,
  },
  {
    label: "High",
    value: "high",
    icon: ArrowUp,
  },
];
