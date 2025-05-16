"use client";

import { getDepartmentWorkSummaryById } from "@/app/actions/departmentWorkSummary";
import DefaultLayout from "@/components/Layouts/DefaultLaout";

import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer,BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts";

const DepartmentDashboard = ({ params }: any) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log(params?.id);
  // Fetch data on client-side using useEffect
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getDepartmentWorkSummaryById(params?.id);

       //  console.log(response);
        setData(response);
        setLoading(false);
      } catch (err) {
        setError(err?.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [params?.id]);

  if (loading) {
    return (
      <DefaultLayout>
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
          <p className="text-lg text-gray-500">Loading data...</p>
        </div>
      </DefaultLayout>
    );
  }

  if (error) {
    return (
      <DefaultLayout>
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
          <p className="text-lg text-red-500">Error: {error}</p>
        </div>
      </DefaultLayout>
    );
  }
/* 
  const pieChartData = [
    { name: "Completed", value: data?.completedWorkPlans, color: "#4CAF50" },
    { name: "In Progress", value: data?.inProgressWorkPlans, color: "#2196F3" },
    { name: "Cancelled", value: data?.cancelledWorkPlans, color: "#F44336" },
    {
      name: "Rescheduled",
      value: data?.rescheduledWorkPlans,
      color: "#FF9800",
    },
  ]; */

  console.log(data);

  return (
    <DefaultLayout>
        <div className="p-6 space-y-8">
      {/* Header */}
      <h1 className="text-2xl font-bold text-center text-gray-700">Section Overview</h1>

      {/* Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="border p-2">Section Name</th>
              <th className="border p-2">Section Head</th>
              <th className="border p-2">Year</th>
              <th className="border p-2">Total Work Plans</th>
              <th className="border p-2">Completed</th>
              <th className="border p-2">Pending</th>
              <th className="border p-2">Budget (USD)</th>
              <th className="border p-2">Actual Used (USD)</th>
              <th className="border p-2">Budget (ZWL)</th>
              <th className="border p-2">Actual Used (ZWL)</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((section) => (
              <tr key={section.sectionId} className="text-center">
                <td className="border p-2">{section.sectionName}</td>
                <td className="border p-2">
                  {section.firstname} {section.lastname} <br />
                  <a href={`mailto:${section.sectionHeadEmail}`} className="text-blue-500 underline">
                    {section.sectionHeadEmail}
                  </a>
                </td>
                <td className="border p-2">{section.year}</td>
                <td className="border p-2">{section.totalWorkPlans}</td>
                <td className="border p-2">{section.completedWorkPlans}</td>
                <td className="border p-2">{section.pendingWorkPlans}</td>
                <td className="border p-2">${section.totalBudgetUSD.toLocaleString()}</td>
                <td className="border p-2">${section.totalActualUsedUSD.toLocaleString()}</td>
                <td className="border p-2">
                  {section.totalBudgetZWL.toLocaleString()} ZWL
                </td>
                <td className="border p-2">
                  {section.totalActualUsedZWL.toLocaleString()} ZWL
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bar Chart */}
      <div>
        <h2 className="text-xl font-semibold text-center text-gray-700 mb-4">
          Budget vs. Actual Usage (USD)
        </h2>
        <BarChart
          width={800}
          height={400}
          data={data}
          className="mx-auto"
          style={{ maxWidth: "100%", overflowX: "auto" }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="sectionName" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="totalBudgetUSD" fill="#8884d8" name="Total Budget (USD)" />
          <Bar dataKey="totalActualUsedUSD" fill="#82ca9d" name="Actual Used (USD)" />
        </BarChart>
      </div>
    </div>
      {/* <div className="min-h-screen bg-gray-100 p-6">
        <div className="mx-auto max-w-5xl rounded-lg bg-white p-6 shadow-md">
          
          <header className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-gray-800">
              Department Performance Overview
            </h1>
            <p className="text-gray-500">Department ID: {params?.id}</p>
          </header>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-lg bg-blue-50 p-4 shadow">
              <h2 className="text-lg font-semibold text-blue-900">
                Total Work Plans
              </h2>
              <p className="text-3xl font-bold text-blue-600">
                {data?.totalWorkPlans}
              </p>
            </div>
            <div className="rounded-lg bg-green-50 p-4 shadow">
              <h2 className="text-lg font-semibold text-green-900">
                Completed Work Plans
              </h2>
              <p className="text-3xl font-bold text-green-600">
                {data?.completedWorkPlans}
              </p>
            </div>
            <div className="rounded-lg bg-yellow-50 p-4 shadow">
              <h2 className="text-lg font-semibold text-yellow-900">
                In Progress Work Plans
              </h2>
              <p className="text-3xl font-bold text-yellow-600">
                {data?.inProgressWorkPlans}
              </p>
            </div>
            <div className="rounded-lg bg-red-50 p-4 shadow">
              <h2 className="text-lg font-semibold text-red-900">
                Cancelled Work Plans
              </h2>
              <p className="text-3xl font-bold text-red-600">
                {data?.cancelledWorkPlans}
              </p>
            </div>
            <div className="rounded-lg bg-orange-50 p-4 shadow">
              <h2 className="text-lg font-semibold text-orange-900">
                Rescheduled Work Plans
              </h2>
              <p className="text-3xl font-bold text-orange-600">
                {data?.rescheduledWorkPlans}
              </p>
            </div>
            <div className="rounded-lg bg-purple-50 p-4 shadow">
              <h2 className="text-lg font-semibold text-purple-900">
                Avg. % Budget Utilized
              </h2>
              <p className="text-3xl font-bold text-purple-600">
                {data?.averagePercentOfBudgetUtilized.toFixed(2)}%
              </p>
            </div>
          </div>

         
          <div className="mt-10">
            <h2 className="mb-6 text-center text-xl font-bold text-gray-800">
              Work Plan Distribution
            </h2>
            <div className="flex justify-center">
              <div className="w-full max-w-md">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      innerRadius={60}
                      label={(entry) => `${entry.name}: ${entry.value}`}
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Completion Rate 
          <div className="mt-10 text-center">
            <h2 className="text-lg font-semibold text-gray-700">
              Overall Completion Rate
            </h2>
            <p className="text-4xl font-bold text-green-600">
              {data.overallCompletionRate.toFixed(2)}%
            </p>
          </div>
        </div>
      </div> */}
    </DefaultLayout>
  );
};

export default DepartmentDashboard;
