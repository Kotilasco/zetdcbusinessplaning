//@ts-nocheck

"use client";

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function CumulativeExpenditureAreaChart({ data }: any) {
  let cumulativeExpenditure = 0;

  const chartData = data.map((item) => {
    cumulativeExpenditure += item.totalExpenditure;
    return {
      week: item.week,
      "Cumulative Expenditure": cumulativeExpenditure,
    };
  });

  return (
    <div className="w-full h-96">
      <h2 className="text-lg font-semibold text-center mb-4">
        Cumulative Expenditure Over Weeks
      </h2>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <XAxis dataKey="week" />
          <YAxis />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="Cumulative Expenditure"
            stroke="#8884d8"
            fill="#8884d8"
            fillOpacity={0.6}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}