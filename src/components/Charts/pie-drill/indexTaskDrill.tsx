//@ts-nocheck

"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getDivisionSummary } from "@/app/actions/departmentWorkSummary";
import { getTaskDetailsForCategory } from "@/app/actions/taskDetails";

const COLORS = [
  "#0088FE", // Complete
  "#00C49F", // Pending
  "#FFBB28", // In Progress
  "#FF8042", // Cancelled
];

const DonutChart = () => {
  const [data, setData] = useState(null); // Store main data
  const [drillData, setDrillData] = useState({}); // Store drill-down data for tasks
  const [selectedTaskCategory, setSelectedTaskCategory] = useState({}); // Track the selected task category for drill-down
  const [filters, setFilters] = useState({
    month: "March",
    year: "2025",
    currency: "USD",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Handle filter change
  const handleFilterChange = (event: any) => {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Fetch main data
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getDivisionSummary({
        month: filters.month,
        year: filters.year,
        currency: filters.currency,
      });
      setData(response);
    } catch (err) {
      setError("Failed to fetch data. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle drill-down click for task progress
  const handleTaskPieClick = useCallback(
    async (entry, departmentId) => {
      const { name } = entry;

      // Prevent drill-down for undefined categories
      if (!name || selectedTaskCategory[departmentId] === name) {
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const drillDownResponse = await getTaskDetailsForCategory({
          departmentId,
          category: name, // Pass the clicked category (e.g., "Complete", "Pending")
        });

        const drillDownFormattedData = drillDownResponse.map((task) => ({
          name: task.taskName,
          value: task.percentageComplete,
        }));

        setDrillData((prev) => ({
          ...prev,
          [departmentId]: drillDownFormattedData,
        }));
        setSelectedTaskCategory((prev) => ({
          ...prev,
          [departmentId]: name,
        }));
      } catch (err) {
        setError(
          `Failed to fetch task details for ${name} in department ${departmentId}. Please try again.`,
        );
      } finally {
        setLoading(false);
      }
    },
    [selectedTaskCategory],
  );

  // Handle back button for task progress
  const handleTaskBackClick = (departmentId) => {
    setDrillData((prev) => ({ ...prev, [departmentId]: [] }));
    setSelectedTaskCategory((prev) => ({ ...prev, [departmentId]: null }));
  };

  const formatPercentage = (value) => {
    if (isNaN(value)) {
      return "0.0%";
    }
    return `${value.toFixed(1)}%`;
  };

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
          <option value="ZWF">ZWG</option>
        </select>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {data.departments.map((dept) => (
          <div
            key={dept.departmentId}
            className="rounded-lg bg-white p-6 shadow-md"
          >
            <h3 className="mb-4 text-lg font-bold">{dept.departmentName}</h3>

            {/* Task Progress Pie Chart */}
            <div className="relative">
              <h4 className="mb-2 text-sm font-semibold">Task Progress</h4>
              {/* Back Button */}
              {selectedTaskCategory[dept.departmentId] && (
                <button
                  onClick={() => handleTaskBackClick(dept.departmentId)}
                  className="absolute left-0 top-0 z-10 rounded bg-blue-500 px-3 py-1 text-xs font-semibold text-white"
                  style={{ transform: "translateY(-100%)" }}
                >
                  ← Back
                </button>
              )}
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={
                      !selectedTaskCategory[dept.departmentId]
                        ? [
                            {
                              name: "Complete",
                              value: dept.percentageComplete,
                            },
                            { name: "Pending", value: dept.percentagePending },
                            {
                              name: "In Progress",
                              value: dept.percentageInProgress,
                            },
                            {
                              name: "Cancelled",
                              value: dept.percentageCancelled,
                            },
                          ]
                        : drillData[dept.departmentId]
                    }
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={65}
                    fill="#8884d8"
                    onClick={(e) =>
                      e.name &&
                      !selectedTaskCategory[dept.departmentId] &&
                      handleTaskPieClick(e, dept.departmentId)
                    }
                    dataKey="value"
                    label={({ percent }) => formatPercentage(percent * 100)}
                  >
                    {!selectedTaskCategory[dept.departmentId]
                      ? [
                          { name: "Complete", value: dept.percentageComplete },
                          { name: "Pending", value: dept.percentagePending },
                          {
                            name: "In Progress",
                            value: dept.percentageInProgress,
                          },
                          {
                            name: "Cancelled",
                            value: dept.percentageCancelled,
                          },
                        ].map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))
                      : drillData[dept.departmentId]?.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [
                      formatPercentage(value),
                      "Percentage",
                    ]}
                  />
                  <Legend
                    layout="horizontal"
                    align="center"
                    verticalAlign="bottom"
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DonutChart;
