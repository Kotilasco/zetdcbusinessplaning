"use client";

// components/LineChart.js
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  {
    monthlyCounts: { February: 2, January: 1 },
    memberName: "Farai Makova",
    memberId: 1,
  },
  {
    monthlyCounts: { January: 1 },
    memberName: "Nyasha Chikobvore",
    memberId: 2,
  },
  {
    monthlyCounts: { February: 1 },
    memberName: "Knowledge Kwaramba",
    memberId: 3,
  },
  {
    monthlyCounts: { February: 1, August: 1 },
    memberName: "Kudakwashe Koti",
    memberId: 4,
  },
  {
    monthlyCounts: { January: 1, march: 3, August: 1 },
    memberName: "Kudakwashe Koti",
    memberId: 5,
  },
  {
    monthlyCounts: { February: 1, march: 3, August: 1 },
    memberName: "Edwin Magodi",
    memberId: 6,
  },
  { monthlyCounts: { march: 1 }, memberName: "Samuel Jarai", memberId: 7 },
  // Add more members as needed
];

// Predefined distinct color palette with 50 colors
const colorPalette = [
  "#FF5733",
  "#FFBD33",
  "#DBFF33",
  "#75FF33",
  "#33FF57",

  "#A3FF33",
  "#73FF33",
  "#33FF75",
  "#33FFAA",
  "#33FFDB",
  "#33B1DB",
  "#3375DB",
  "#3357DB",
  "#5733DB",
  "#BD33DB",
  "#FF33DB",
  "#FF33AA",
  "#FF3377",
  "#FF3357",
  "#FF3333",
  "#33FF8C",
  "#33FFB1",
  "#33FFFF",
  "#33B1FF",
  "#3375FF",
  "#3357FF",
  "#5733FF",
  "#BD33FF",
  "#FF33DB",
  "#FF3375",
  "#FF3333",
  "#FF7F33",
  "#FFAA33",
  "#FFD733",
  "#D3FF33",
  "#A3FF33",
  "#73FF33",
  "#33FF75",
  "#33FFAA",
  "#33FFDB",
  "#33B1DB",
  "#3375DB",
  "#3357DB",
  "#5733DB",
  "#BD33DB",
  "#FF33DB",
  "#FF33AA",
  "#FF3377",
  "#FF3357",
  "#FF3357",
  "#FF5733",
  "#FF7F33",
  "#FFAA33",
  "#FFD733",
  "#D3FF33",
];

const LineChartComponent = () => {
  const chartData = [];

  // Prepare data for each member
  data.forEach((member) => {
    Object.entries(member.monthlyCounts).forEach(([month, count]) => {
      const existingEntry = chartData.find((entry) => entry.month === month);
      if (existingEntry) {
        existingEntry[member.memberName] = count;
      } else {
        chartData.push({ month, [member.memberName]: count });
      }
    });
  });

  // Fill in missing values with 0
  chartData.forEach((entry) => {
    data.forEach((member) => {
      if (!entry[member.memberName]) {
        entry[member.memberName] = 0;
      }
    });
  });

  return (
    <div>
      <h2>Monthly Counts for Each Member</h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          {data.map((member, index) => (
            <Line
              key={member.memberId}
              type="monotone"
              dataKey={member.memberName}
              stroke={
                colorPalette[index] || colorPalette[index % colorPalette.length]
              } // Assign color dynamically
              activeDot={{ r: 8 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChartComponent;
