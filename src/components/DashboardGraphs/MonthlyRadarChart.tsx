//@ts-nocheck

"use client";

import React from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function BudgetMetricsRadarChart({ data }: any) {
  const chartData = data.map((item) => ({
    week: item.week,
    "Percent of Budget Used": item.percentOfBudgetUsed,
    "Count Exceeding Budget": item.countExceedingBudget,
  }));

  return (
    <div className="h-96 w-full">
      <h2 className="mb-4 text-center text-lg font-semibold">
        Budget Metrics Radar Chart
      </h2>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={chartData}>
          <PolarGrid />
          <PolarAngleAxis dataKey="week" />
          <PolarRadiusAxis />
          <Tooltip />
          <Radar
            name="Percent of Budget Used"
            dataKey="Percent of Budget Used"
            stroke="#8884d8"
            fill="#8884d8"
            fillOpacity={0.6}
          />
          <Radar
            name="Count Exceeding Budget"
            dataKey="Count Exceeding Budget"
            stroke="#82ca9d"
            fill="#82ca9d"
            fillOpacity={0.6}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
