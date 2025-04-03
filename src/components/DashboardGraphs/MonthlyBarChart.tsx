//@ts-nocheck

"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function WeeklyExpenditureBarChart({ data }) {
  const chartData = data.map((item) => ({
    week: item.week,
    Expenditure: item.totalExpenditure,
    Budget: item.totalBudget,
  }));

  return (
    <div className="w-full h-96">
      <h2 className="text-lg font-semibold text-center mb-4">
        Weekly Expenditure vs Budget
      </h2>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <XAxis dataKey="week" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Expenditure" fill="#8884d8" />
          <Bar dataKey="Budget" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}