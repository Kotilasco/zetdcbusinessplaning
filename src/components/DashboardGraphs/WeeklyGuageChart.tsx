//@ts-nocheck

"use client";

import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#8884d8", "#d3d3d3"]; // Color for "Used" and "Remaining"

export default function BudgetUsageGauge({ data }) {
  const percentUsed = data?.[0]?.percentOfBudgetUsed || 0; // Use the percentage value
  const chartData = [
    { name: "Used", value: percentUsed },
    { name: "Remaining", value: 100 - percentUsed },
  ];

  return (
    <div className="h-96 w-full">
      <h2 className="mb-4 text-center text-lg font-semibold">
        Percent of Budget Used
      </h2>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          {/* Add the Pie and Tooltip */}
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={100}
            startAngle={180}
            endAngle={0}
            fill="#8884d8"
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name) => [`${value.toFixed(2)}%`, name]}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-2 text-center text-lg font-semibold">
        {percentUsed?.toFixed(2)}% Used
      </div>
    </div>
  );
}
