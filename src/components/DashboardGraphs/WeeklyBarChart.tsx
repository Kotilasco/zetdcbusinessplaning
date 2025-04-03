//@ts-nocheck

"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function WeeklyExpenditureBarChart({ data }) {
  const chartData = [
    { name: "Expenditure", value: data.totalExpenditure },
    { name: "Remaining", value: Math.max(data.totalBudget - data.totalExpenditure, 0) },
  ];

  return (
    <div className="w-full h-96">
      <h2 className="text-lg font-semibold text-center mb-4">
        Weekly Expenditure vs Remaining Budget
      </h2>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}