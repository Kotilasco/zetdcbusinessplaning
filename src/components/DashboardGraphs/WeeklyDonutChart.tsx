//@ts-nocheck

"use client";

import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#8884d8", "#82ca9d"]; // Color scheme for "Used" and "Remaining"

export default function WeeklyBudgetDonutChart({ data }) {
  const chartData = [
    { name: "Used", value: data?.[0]?.totalExpenditure },
    {
      name: "Remaining",
      value: Math.max(data?.[0]?.totalBudget - data?.[0]?.totalExpenditure, 0),
    },
  ];

  return (
    <div className="h-96 w-full">
      <h2 className="mb-4 text-center text-lg font-semibold">
        Weekly Budget Breakdown
      </h2>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            fill="#8884d8"
            label
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
