"use client";

import React, { useState } from "react";
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

const sampleData = {
  divisionName: "SMITIRD",
  currencies: ["USD", "GBP"],
  years: ["2025", "2024"],
  months: ["March", "February"],
  metrics: ["Budget", "Expenditure", "Overdue Tasks"],
  departments: [
    {
      departmentName: "Information Technology",
      sections: ["Networks", "Programming", "Support"],
      metrics: {
        "2025": {
          March: {
            USD: {
              Networks: { budget: 5000, expenditure: 2000, overdueTasks: 3 },
              Programming: { budget: 4000, expenditure: 1500, overdueTasks: 5 },
              Support: { budget: 3192, expenditure: 945, overdueTasks: 4 },
            },
            GBP: {
              Networks: { budget: 4500, expenditure: 1800, overdueTasks: 2 },
              Programming: { budget: 3500, expenditure: 1350, overdueTasks: 3 },
              Support: { budget: 3000, expenditure: 800, overdueTasks: 3 },
            },
          },
          February: {
            USD: {
              Networks: { budget: 5200, expenditure: 2100, overdueTasks: 4 },
              Programming: { budget: 3800, expenditure: 1400, overdueTasks: 4 },
              Support: { budget: 3000, expenditure: 1000, overdueTasks: 2 },
            },
            GBP: {
              Networks: { budget: 4200, expenditure: 1600, overdueTasks: 2 },
              Programming: { budget: 3400, expenditure: 1200, overdueTasks: 1 },
              Support: { budget: 2800, expenditure: 900, overdueTasks: 3 },
            },
          },
        },
      },
    },
    {
      departmentName: "System Development",
      sections: ["Web", "Mobile"],
      metrics: {
        "2025": {
          March: {
            USD: {
              Web: { budget: 3000, expenditure: 1000, overdueTasks: 1 },
              Mobile: { budget: 2500, expenditure: 1200, overdueTasks: 0 },
            },
            GBP: {
              Web: { budget: 2800, expenditure: 1100, overdueTasks: 1 },
              Mobile: { budget: 2200, expenditure: 1000, overdueTasks: 0 },
            },
          },
        },
      },
    },
  ],
};

function DashboardWithFilters() {
  // State for filters
  const [currency, setCurrency] = useState("USD");
  const [year, setYear] = useState("2025");
  const [month, setMonth] = useState("All Months");
  const [department, setDepartment] = useState("Information Technology");
  const [section, setSection] = useState("All Sections");
  const [metric, setMetric] = useState("Budget");

  // Extract the filtered department
  const filteredDepartment = sampleData.departments.find(
    (dept) => dept.departmentName === department,
  );

  // Get sections for the selected department
  const sections = ["All Sections", ...(filteredDepartment?.sections || [])];

  // Aggregate data for the entire year if no month is selected
  const aggregateYearData = (metricsForYear) => {
    const aggregatedData = {};

    for (const monthKey in metricsForYear) {
      const monthData = metricsForYear[monthKey]?.[currency] || {};
      for (const sectionKey in monthData) {
        if (!aggregatedData[sectionKey]) {
          aggregatedData[sectionKey] = {
            budget: 0,
            expenditure: 0,
            overdueTasks: 0,
          };
        }
        const sectionMetrics = monthData[sectionKey];
        aggregatedData[sectionKey].budget += sectionMetrics.budget || 0;
        aggregatedData[sectionKey].expenditure +=
          sectionMetrics.expenditure || 0;
        aggregatedData[sectionKey].overdueTasks +=
          sectionMetrics.overdueTasks || 0;
      }
    }

    return aggregatedData;
  };

  // Extract metrics for the graph
  const filteredMetrics =
    month === "All Months"
      ? aggregateYearData(filteredDepartment?.metrics?.[year] || {})
      : filteredDepartment?.metrics?.[year]?.[month]?.[currency] || {};

  const graphData =
    section === "All Sections"
      ? Object.entries(filteredMetrics).map(([sectionName, metrics]) => ({
          name: sectionName,
          value: metrics[metric.toLowerCase()] || 0,
        }))
      : [
          {
            name: section,
            value: filteredMetrics[section]?.[metric.toLowerCase()] || 0,
          },
        ];

  return (
    <div className="space-y-8 p-4">
      <h1 className="text-center text-2xl font-bold">
        Dashboard: {sampleData.divisionName}
      </h1>

      {/* Filters */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Tabs for Currency */}
        <div className="flex flex-col md:col-span-2">
          <label className="mb-2 text-sm font-semibold text-gray-600">
            Currency
          </label>
          <div className="flex space-x-4">
            {sampleData.currencies.map((cur) => (
              <button
                key={cur}
                onClick={() => setCurrency(cur)}
                className={`rounded border px-4 py-2 ${
                  currency === cur
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {cur}
              </button>
            ))}
          </div>
        </div>

        {/* Year Selector */}
        <div className="flex flex-col">
          <label className="mb-2 text-sm font-semibold text-gray-600">
            Year
          </label>
          <select
            value={year}
            onChange={(e) => {
              setYear(e.target.value);
              setMonth("All Months");
            }}
            className="rounded border border-gray-300 p-2"
          >
            {sampleData.years.map((yr) => (
              <option key={yr} value={yr}>
                {yr}
              </option>
            ))}
          </select>
        </div>

        {/* Month Selector */}
        <div className="flex flex-col">
          <label className="mb-2 text-sm font-semibold text-gray-600">
            Month
          </label>
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="rounded border border-gray-300 p-2"
          >
            <option value="All Months">All Months</option>
            {sampleData.months.map((mon) => (
              <option key={mon} value={mon}>
                {mon}
              </option>
            ))}
          </select>
        </div>

        {/* Department Selector */}
        <div className="flex flex-col">
          <label className="mb-2 text-sm font-semibold text-gray-600">
            Department
          </label>
          <select
            value={department}
            onChange={(e) => {
              setDepartment(e.target.value);
              setSection("All Sections");
            }}
            className="rounded border border-gray-300 p-2"
          >
            {sampleData.departments.map((dept) => (
              <option key={dept.departmentName} value={dept.departmentName}>
                {dept.departmentName}
              </option>
            ))}
          </select>
        </div>

        {/* Section Selector */}
        <div className="flex flex-col">
          <label className="mb-2 text-sm font-semibold text-gray-600">
            Section
          </label>
          <select
            value={section}
            onChange={(e) => setSection(e.target.value)}
            className="rounded border border-gray-300 p-2"
          >
            {sections.map((sec) => (
              <option key={sec} value={sec}>
                {sec}
              </option>
            ))}
          </select>
        </div>

        {/* Metric Selector */}
        <div className="flex flex-col">
          <label className="mb-2 text-sm font-semibold text-gray-600">
            Metric
          </label>
          <select
            value={metric}
            onChange={(e) => setMetric(e.target.value)}
            className="rounded border border-gray-300 p-2"
          >
            {sampleData.metrics.map((met) => (
              <option key={met} value={met}>
                {met}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Graph */}
      <div className="h-96 w-full">
        <h3 className="mb-4 text-center text-xl font-semibold">
          {metric} for {section === "All Sections" ? "All Sections" : section}{" "}
          in {department} ({currency},{" "}
          {month === "All Months" ? "Entire Year" : month} {year})
        </h3>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={graphData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#4caf50"
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default DashboardWithFilters;
