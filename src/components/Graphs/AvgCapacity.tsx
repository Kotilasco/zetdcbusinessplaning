"use client"; // Required for client-side rendering in Next.js 14

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const sampleData = [
  { source: "KARIBA", Planned: 315, Actual: 224.04, Variance: -90.96 },
  { source: "HWANGE", Planned: 416, Actual: 351.55, Variance: -64.45 },
  { source: "HESCO", Planned: 600, Actual: 602.97, Variance: 2.97 },
  { source: "IPPS", Planned: 175, Actual: 43.12, Variance: -131.88 },
  { source: "HCB", Planned: 50, Actual: 150, Variance: 100 },
  { source: "ESKOM", Planned: 400, Actual: 355, Variance: -45 },
  { source: "ZESCO", Planned: 50, Actual: 0, Variance: -50 },
  { source: "ZIMPLATS", Planned: 38, Actual: 45, Variance: 7 },
  { source: "EDM", Planned: 200, Actual: 50, Variance: -150 },
  { source: "DAM", Planned: 50, Actual: 0, Variance: -50 },
];

export default function AverageCapacityChart() {
  return (
    <div className="w-full h-96">
      <h2 className="text-center font-semibold text-lg">AVERAGE CAPACITY BY SOURCE (MW)</h2>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={sampleData}
          margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="source"
            interval={0}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Planned" fill="#8884d8" name="Planned (MW)" />
          <Bar dataKey="Actual" fill="#82ca9d" name="Actual (MW)" />
          <Bar dataKey="Variance" fill="#ffc658" name="Variance (MW)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}