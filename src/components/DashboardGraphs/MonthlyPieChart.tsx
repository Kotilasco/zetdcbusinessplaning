//@ts-nocheck

"use client";

import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Expanded color scheme with 8 distinct colors
const COLORS = [
  "#8884d8", // Purple
  "#82ca9d", // Green
  "#ffc658", // Yellow
  "#ff8042", // Orange
  "#8dd1e1", // Light Blue
  "#d0ed57", // Lime Green
  "#a4de6c", // Light Green
  "#ffbb28", // Gold
];

export default function MonthlyBudgetAllocationPieChart({ monthlyData }: any) {
  const data = monthlyData?.flatMap((item) => [
    {
      name: `${item.week} - Used`,
      value: item.totalExpenditure,
    },
    {
      name: `${item.week} - Remaining`,
      value: Math.max(item.totalBudget - item.totalExpenditure, 0), // Ensure no negative values
    },
  ]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart height={200}>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={150}
          fill="#8884d8"
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
