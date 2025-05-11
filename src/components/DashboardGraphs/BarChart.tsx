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
  ResponsiveContainer,
} from "recharts";

const BarCHart = ({ departmentData }: any) => {
  const [isLoading, setIsLoading] = useState(true);

  /*   useEffect(() => {
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

  /*  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  } */

  console.log(departmentData);

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

  // Custom colors for each bar
  const barColors = {
    Completed: "#4caf50", // Green
    "In Progress": "#2196f3", // Blue
    Cancelled: "#f44336", // Red
    Rescheduled: "#ff9800", // Orange
  };

  console.log(departmentData);

  return (
    <div className="flex w-full flex-col items-center">
      {/* Line Chart */}
      <div className="h-96 w-full max-w-4xl rounded-lg bg-white p-4 shadow-md">
        <h2 className="mb-4 text-center text-xl font-semibold">
          Work Plan Trend
        </h2>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={workPlanData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value">
              {workPlanData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={barColors[entry.name]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BarCHart;
