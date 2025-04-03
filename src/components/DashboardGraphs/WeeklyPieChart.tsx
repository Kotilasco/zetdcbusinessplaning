//@ts-nocheck

"use client";

import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = [
  "#8884d8", // Purple
  "#82ca9d", // Green
  "#ffc658", // Yellow
  "#ff8042", // Orange
  "#8dd1e1", // Light Blue
  "#d0ed57", // Lime Green
  "#a4de6c", // Light Green
  "#ffbb28", // Gold
]; // Colors for the chart sections

export default function BudgetPieChart({ data }: any) {
  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        No data to display
      </div>
    );
  }

  console.log(data);

  const updatedData = [
    {
      name: "Budget Used",
      value: parseFloat(data?.[0]?.percentOfBudgetUsed.toFixed(2)) || 0, // Round to 2 decimal places
    },
    {
      name: "Remaining Budget",
      value: parseFloat((100 - data?.[0]?.percentOfBudgetUsed).toFixed(2)) || 0, // Calculate and round to 2 decimal places
    },
  ];

  console.log(updatedData);

  return (
    <PieChart width={400} height={400}>
      <Pie
        data={updatedData}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        outerRadius={150}
        fill="#8cc4c8"
        label
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  );
}
