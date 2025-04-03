//@ts-nocheck

"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function WeeklyBudgetLineChart({ data }) {
  const chartData = [
    { name: "Week 1", Expenditure: data.totalExpenditure, Budget: data.totalBudget },
  ];

  return (
    <div className="w-full h-96">
      <h2 className="text-lg font-semibold text-center mb-4">
        Weekly Budget vs Expenditure
      </h2>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="Expenditure" stroke="#8884d8" />
          <Line type="monotone" dataKey="Budget" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}