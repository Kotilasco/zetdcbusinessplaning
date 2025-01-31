"use client"; // Ensures client-side rendering for Next.js 14

import React from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const sampleData = [
  { quarter: "Q1 2023", Actual: 14.69, Target: 14, Variance: 0.69 },
  { quarter: "Q2 2023", Actual: 28.09, Target: 14, Variance: 14.09 },
  { quarter: "Q3 2023", Actual: 18.17, Target: 14, Variance: 4.17 },
  { quarter: "Q4 2023", Actual: 10.12, Target: 14, Variance: -3.88 },
  { quarter: "Q1 2024", Actual: 20.33, Target: 14, Variance: 6.33 },
  { quarter: "Q2 2024", Actual: 23.11, Target: 14, Variance: 9.11 },
  { quarter: "Q3 2024", Actual: 21.15, Target: 14, Variance: 7.15 },
  { quarter: "Q4 2024", Actual: 14, Target: 14, Variance: 0 },
];

export default function TotalSystemLossesTrendChart() {
  return (
    <div className="h-96 w-full">
      <h2 className="text-center text-lg font-semibold text-red-600">
        Total System Losses Trend
      </h2>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={sampleData}
          margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="quarter"
            angle={-45}
            textAnchor="end"
            height={60}
            label={{ value: "Quarter", position: "insideBottom", offset: -10 }}
          />
          <YAxis
            label={{
              value: "Losses (%)",
              angle: -90,
              position: "insideLeft",
            }}
          />
          <Tooltip />
          <Legend verticalAlign="bottom" />

          <Line
            type="linear"
            dataKey="Actual"
            stroke="#007bff"
            strokeWidth={2}
            name="ACTUAL"
          />
          <Line
            type="linear"
            dataKey="Target"
            stroke="#ff7300"
            strokeWidth={2}
            name="TARGET"
            dot={{ r: 4 }}
          />
          <Line
            type="linear"
            dataKey="Variance"
            stroke="#888888"
            strokeWidth={2}
            name="VARIANCE"
            strokeDasharray="5 5"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
