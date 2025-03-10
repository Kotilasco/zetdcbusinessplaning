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

const Summary = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [departmentData, setDepartmentData] = useState(null);

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
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!departmentData) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        No data to display
      </div>
    );
  }

  // Data for graphs
  const workPlanData = [
    { name: "Completed", value: departmentData?.completedWorkPlans },
    { name: "In Progress", value: departmentData?.inProgressWorkPlans },
    { name: "Cancelled", value: departmentData?.cancelledWorkPlans },
    { name: "Rescheduled", value: departmentData?.rescheduledWorkPlans },
  ];

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

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Bar Chart */}
        <div className="rounded-lg bg-white p-4 shadow-md">
          <h2 className="mb-4 text-center text-xl font-semibold">
            Work Plan Distribution
          </h2>
          <BarChart
            width={400}
            height={300}
            data={workPlanData}
            className="mx-auto"
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </div>

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

        {/* Line Chart */}
        <div className="rounded-lg bg-white p-4 shadow-md">
          <h2 className="mb-4 text-center text-xl font-semibold">
            Work Plan Trend
          </h2>
          <LineChart
            width={400}
            height={300}
            data={workPlanData}
            className="mx-auto"
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="#8884d8" />
          </LineChart>
        </div>
      </div>
    </div>
  );
};

export default Summary;
