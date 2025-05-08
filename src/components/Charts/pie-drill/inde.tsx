//@ts-nocheck

"use client";

import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getDivisionSummary } from "@/app/actions/departmentWorkSummary";
import { getBudgetUsageForEachSection } from "@/app/actions/budgetUsageForEachSection";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#A28DFF",
  "#FF6F91",
];

// Initial data
const dataA = [
  { name: "Category 1", value: 1000 },
  { name: "Category 2", value: 2000 },
  { name: "Category 3", value: 3000 },
];

// Drill-down data
const drillDownData = {
  "Category 1": [
    { name: "Subcategory 1", value: 500 },
    { name: "Subcategory 2", value: 500 },
  ],
  "Category 2": [
    { name: "Subcategory 3", value: 1000 },
    { name: "Subcategory 4", value: 1000 },
  ],
  "Category 3": [
    { name: "Subcategory 5", value: 1500 },
    { name: "Subcategory 6", value: 1500 },
  ],
};

const DonutChart = () => {
  const [drillData, setDrillData] = useState();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    month: "March",
    year: "2025",
    currency: "USD",
  });

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleFilterChange = (event: any) => {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handlePieClick = async (entry: any, departmentId: string) => {
    console.log("llllll");
    setLoading(true);
    setError(null);

    try {
      // Call the server action to fetch drill-down data
      const data = await getBudgetUsageForEachSection({
        month: filters.month,
        year: filters.year,
        currency: filters.currency,
        departmentId: departmentId,
      });
      console.log("Drill-Down Data:", data);

      // Update the chart data with the drill-down data
      const drillDownData = data.map((section) => ({
        name: section.sectionName,
        value: section.percentageUsage,
      }));

      setDrillData(drillDownData); // Update chartData with drill-down data
      setSelectedCategory(entry.name); // Set the selected category
    } catch (err) {
      setError("Failed to fetch drill-down data. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBackClick = () => {
    // Reset the chart data to the main chart
    setDrillData([]); // Reset to the main data
    setSelectedCategory(null); // Clear the selected category
  };

  // Fetch data from the backend
  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getDivisionSummary({
        month: filters.month,
        year: filters.year,
        currency: filters.currency,
      });
      console.log(response);
      setData(response);
    } catch (err) {
      setError("Failed to fetch data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount and when filters change
  useEffect(() => {
    fetchData();
  }, [filters]);

  console.log(data);

  if (!data || !Array.isArray(data.departments)) {
    return <div className="p-6 text-center">No data available.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {loading && <div className="text-center">Loading...</div>}
      {error && <div className="text-center text-red-500">{error}</div>}

      {/* Filters Section */}
      <div className="mb-6 flex flex-wrap gap-4">
        <select
          name="month"
          value={filters.month}
          onChange={handleFilterChange}
          className="rounded-md border bg-white px-4 py-2 shadow-sm"
        >
          <option>January</option>
          <option>February</option>
          <option>March</option>
          <option>April</option>
          <option>May</option>
          <option>June</option>
          <option>July</option>
          <option>August</option>
          <option>September</option>
          <option>October</option>
          <option>November</option>
          <option>December</option>
        </select>
        <select
          name="year"
          value={filters.year}
          onChange={handleFilterChange}
          className="rounded-md border bg-white px-4 py-2 shadow-sm"
        >
          <option>2024</option>
          <option>2025</option>
          <option>2026</option>
        </select>
        <select
          name="currency"
          value={filters.currency}
          onChange={handleFilterChange}
          className="rounded-md border bg-white px-4 py-2 shadow-sm"
        >
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="GBP">GBP</option>
        </select>
      </div>

      {/* Cards Section */}
      <div className="grid grid-cols-1">
        {data.departments.map((dept) => (
          <div
            key={dept.departmentId}
            className="rounded-lg bg-white p-6 shadow-md"
          >
            <h3 className="mb-4 text-lg font-bold">{dept.departmentName}</h3>

            {/* Charts Section */}
            <div className="grid grid-cols-1 gap-6">
              {/* Budget Usage Pie Chart */}
              <div>
                <h4 className="mb-2 text-sm font-semibold">
                  {selectedCategory || "Budget Usage"}
                </h4>
                {/* Back Button */}
                {selectedCategory && (
                  <button
                    onClick={handleBackClick}
                    className="mb-4 rounded bg-blue-500 px-4 py-2 text-white"
                  >
                    ← Back to Main Chart
                  </button>
                )}
                <ResponsiveContainer width={40} height={400}>
                  <PieChart>
                    <Pie
                     
                    >
                      {!selectedCategory
                        ? [
                            { name: "Used", value: data.percentageBudget },
                            {
                              name: "Remaining",
                              value: 100 - data.percentageBudget,
                            },
                          ].map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))
                        : drillData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                    </Pie>
                    <Legend />
                    <Tooltip position={"top"} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Task Progress Pie Chart */}
              <div>
                <h4 className="mb-2 text-sm font-semibold">Task Progress</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Complete", value: dept.percentageComplete },
                        { name: "Pending", value: dept.percentagePending },
                        {
                          name: "In Progress",
                          value: dept.percentageInProgress,
                        },
                        { name: "Cancelled", value: dept.percentageCancelled },
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label
                    >
                      {COLORS.map((color, index) => (
                        <Cell key={`cell-${index}`} fill={color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Overdue Tasks Pie Chart */}
              <div>
                <h4 className="mb-2 text-sm font-semibold">Overdue Tasks</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Overdue", value: dept.percentageOverdue },
                        {
                          name: "On Time",
                          value: 100 - dept.percentageOverdue,
                        },
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label
                    >
                      <Cell fill="#FF4560" />
                      <Cell fill="#00C49F" />
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DonutChart;
