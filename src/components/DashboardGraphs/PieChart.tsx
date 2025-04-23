"use client";

import { getDepartmentWorkSummary } from "@/app/actions/departmentWorkSummary";
import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

const PieGraph = ({ departmentData }: any) => {
  const [isLoading, setIsLoading] = useState(true);
  /* 
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Simulate API call with a timeout
        const response = await getDepartmentWorkSummary();
        setDepartmentData(response);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []); */

  if (!departmentData) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        No data to display
      </div>
    );
  }

  const budgetData = [
    {
      name: "Budget Utilized (%)",
      value: departmentData?.averagePercentOfBudgetUtilized,
    },
    {
      name: "Unused Budget (%)",
      value: 100 - departmentData?.averagePercentOfBudgetUtilized,
    },
  ];

  const completionRateData = [
    {
      name: "Overall Completion Rate (%)",
      value: departmentData?.overallCompletionRate,
    },
    {
      name: "Remaining Work (%)",
      value: 100 - departmentData?.overallCompletionRate,
    },
  ];

  console.log(departmentData);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="grid grid-cols-1 gap-8">
        {/* Pie Chart - Budget Utilization */}
        <div className="rounded-lg bg-white p-4 shadow-md">
          <h2 className="mb-4 text-center text-xl font-semibold">
            Budget Utilization
          </h2>
          <PieChart width={400} height={300} className="mx-auto">
            <Pie
              data={budgetData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#82ca9d"
              label
            >
              {budgetData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={index === 0 ? "#82ca9d" : "#ffc658"}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>

        {/* Pie Chart - Completion Rate */}
        <div className="rounded-lg bg-white p-4 shadow-md">
          <h2 className="mb-4 text-center text-xl font-semibold">
            Completion Rate
          </h2>
          <PieChart width={400} height={300} className="mx-auto">
            <Pie
              data={completionRateData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label
            >
              {completionRateData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={index === 0 ? "#8884d8" : "#ffc658"}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>
      </div>
    </div>
  );
};

export default PieGraph;
