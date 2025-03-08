"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const TaskDataVisualization = ({ data }: any) => {
  // Sample data

  // Add missing statuses with taskCount = 0
  const allStatuses = ["IN_PROGRESS", "COMPLETED", "PENDING", "CANCELLED"];
  const completeData = allStatuses.map((status) => {
    const found = data?.find((item: any) => item.status === status);
    return found ? found : { taskCount: 0, status };
  });

  // Colors for the Pie Chart
  const colors = ["#8884d8", "#82ca9d", "#ff4658", "#ff6f61"];

  return (
    <div className="flex flex-col items-center space-y-8">
      <h1 className="text-2xl font-bold">Task Status Visualization</h1>

      {/* Bar Chart */}
      <div className="w-full max-w-2xl bg-green-900">
        <BarChart
          width={500}
          height={300}
          data={completeData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="status" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="taskCount" fill="#8884d8" />
        </BarChart>
      </div>
    </div>
  );
};

export default TaskDataVisualization;
