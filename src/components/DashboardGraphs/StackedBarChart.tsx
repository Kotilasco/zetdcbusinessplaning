"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

/* const data = [
  {
    week: "week1",
    totalExpenditure: 400,
    remainingBudget: 2831 - 400, // Calculate the remaining budget
    totalBudget: 2831,
    percentOfBudgetUsed: 14.13,
  },
]; */

export default function StackedBarChart({ data }: any) {
  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        No data to display
      </div>
    );
  }

  const updatedData = data.map((item: any) => ({
    ...item,
    remainingBudget: item.totalBudget - item.totalExpenditure,
  }));

  console.log(updatedData);

  return (
    <BarChart
      width={500}
      height={300}
      data={updatedData}
      margin={{
        top: 20,
        right: 30,
        left: 20,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="week" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar
        dataKey="totalExpenditure"
        stackId="a"
        fill="#8884d8"
        name="Expenditure"
      />
      <Bar
        dataKey="remainingBudget"
        stackId="a"
        fill="#82ca9d"
        name="Remaining Budget"
      />
    </BarChart>
  );
}
