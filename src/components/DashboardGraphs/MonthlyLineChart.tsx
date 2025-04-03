//@ts-nocheck

"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

export default function MonthlyLineGraph({ monthlyData }: any) {
  console.log(monthlyData);

  const data = monthlyData?.map((item) => ({
    week: item.week,
    percentOfBudgetUsed: parseFloat(item.percentOfBudgetUsed.toFixed(2)), // Round to two decimal places
  }));

  return (
    <LineChart
      width={500}
      height={300}
      data={data}
      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="week" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line
        type="monotone"
        dataKey="percentOfBudgetUsed"
        stroke="#8884d8"
        name="Budget Used (%)"
      />
    </LineChart>
  );
}
