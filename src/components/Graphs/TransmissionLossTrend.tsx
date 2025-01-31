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
  { quarter: "Q1 2023", Actual: 4.08, Target: 4.5, Variance: -0.42 },
  { quarter: "Q2 2023", Actual: 4.35, Target: 4.5, Variance: -0.15 },
  { quarter: "Q3 2023", Actual: 4.41, Target: 4.5, Variance: -0.09 },
  { quarter: "Q4 2023", Actual: 3.93, Target: 4.5, Variance: -0.57 },
  { quarter: "Q1 2024", Actual: 3.95, Target: 4.5, Variance: -0.55 },
  { quarter: "Q2 2024", Actual: 4.04, Target: 4.5, Variance: -0.46 },
];

export default function TransmissionLossesTrendChart() {
  return (
    <div className="h-96 w-full">
      <h2 className="text-center text-lg font-semibold text-red-600">
        Transmission Losses Trend
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
              value: "Losses",
              angle: -90,
              position: "insideLeft",
            }}
            domain={[0, 5]} // Adjust the Y-axis domain as needed
          />
          <Tooltip />
          <Legend verticalAlign="top" />
          <Line
            type="linear" // Straight lines
            dataKey="Actual"
            stroke="#007bff"
            strokeWidth={2}
            name="Actual Losses"
          />
          <Line
            type="linear" // Straight lines
            dataKey="Target"
            stroke="#ff7300"
            strokeWidth={2}
            name="Target Losses"
            dot={{ r: 4 }}
          />
          <Line
            type="linear" // Straight lines
            dataKey="Variance"
            stroke="#888888"
            strokeWidth={2}
            name="Variance"
            strokeDasharray="5 5"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
