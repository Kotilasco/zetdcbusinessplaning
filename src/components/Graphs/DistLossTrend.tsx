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
  { quarter: "Q1 2023", Actual: 6.5, Target: 10, Variance: -3.5 },
  { quarter: "Q2 2023", Actual: 11.07, Target: 10, Variance: 1.07 },
  { quarter: "Q3 2023", Actual: 15.28, Target: 10, Variance: 5.28 },
  { quarter: "Q4 2023", Actual: 14.3, Target: 10, Variance: 4.3 },
  { quarter: "Q1 2024", Actual: 10.17, Target: 10, Variance: 0.17 },
  { quarter: "Q2 2024", Actual: 19.8, Target: 10, Variance: 9.8 },
  { quarter: "Q3 2024", Actual: 13.5, Target: 10, Variance: 3.5 },
  { quarter: "Q4 2024", Actual: 10, Target: 10, Variance: 0 },
];

export default function DistributionLossesTrendChart() {
  return (
    <div className="w-full h-96">
      <h2 className="text-center font-semibold text-lg text-gray-600">
        Distribution Losses Trend
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
            domain={[0, 20]} // Adjust the Y-axis domain as needed
          />
          <Tooltip />
          <Legend verticalAlign="top" />
          <Line
            type="linear" // Straight lines
            dataKey="Actual"
            stroke="#007bff"
            strokeWidth={2}
            name="Actual %"
          />
          <Line
            type="linear" // Straight lines
            dataKey="Target"
            stroke="#ff7300"
            strokeWidth={2}
            name="Target %"
            dot={{ r: 4 }}
          />
          <Line
            type="linear" // Straight lines
            dataKey="Variance"
            stroke="#888888"
            strokeWidth={2}
            name="Variance %"
            strokeDasharray="5 5"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}