//@ts-nocheck

"use client";

// components/PieChart.js
import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#FF5733",
  "#33FF57",
  "#3357FF",
  "#F1C40F",
  "#A3FF33",
  "#73FF33",
  "#33FF75",
  "#33FFAA",
  "#33FFDB",
  "#33B1DB",
  "#3375DB",
  "#3357DB",
  "#5733DB",
  "#BD33DB",
  "#FF33DB",
  "#FF33AA",
  "#FF3377",
  "#FF3357",
  "#FF3333",
  "#33FF8C",
  "#33FFB1",
  "#33FFFF",
  "#33B1FF",
];

const DepartmentPieChart = ({ pieData }: any) => {
  if (!pieData) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        No data to display
      </div>
    );
  }

  console.log(pieData);

  return (
    <div>
      <h2>Overdue Tasks by Section in {pieData?.departmentName}</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={pieData.overdueTasks}
            dataKey="overdueCount"
            nameKey="departmentName"
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            label
          >
            {pieData?.overdueTasks?.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DepartmentPieChart;
