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
import { getOverdueTasksByDepartment } from "@/app/actions/getOverdueTasksByDepartment";

const COLORS = [
  "#0088FE", // Complete
  "#00C49F", // Pending
  "#FFBB28", // In Progress
  "#FF8042", // Cancelled
];

const DonutChart = () => {
  const [drillData, setDrillData] = useState({});
  const [selectedCategory, setSelectedCategory] = useState({});
  const [drillDataOverdue, setDrillDataOverdue] = useState({});
  const [selectedCategoryOverdue, setSelectedCategoryOverdue] = useState({});
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

  const handlePieClick = useCallback(
    async (entry: any, departmentId: string, type: string) => {
      if (entry.name === "Used" && type === "budget") {
        // Handle Budget Drill-Down
        setLoading(true);
        setError(null);

        try {
          /* const drillDownResponse = await getBudgetUsageForEachSection({
              month: filters.month,
              year: filters.year,
              currency: filters.currency,
              departmentId: departmentId,
            }); */

          console.log(departmentId);

          const drillDownResponse = await getOverdueTasksByDepartment({
            departmentId,
          });

          const drillDownFormattedData = drillDownResponse?.overdueTasks?.map(
            (section) => ({
              name: section.sectionName,
              value: section.percentageContribution,
            }),
          );

          setDrillData((prev) => ({
            ...prev,
            [departmentId]: drillDownFormattedData,
          }));
          setSelectedCategory((prev) => ({
            ...prev,
            [departmentId]: entry.name,
          }));
        } catch (err) {
          setError(
            `Failed to fetch drill-down data for ${departmentId}. Please try again.`,
          );
          console.error(err);
        } finally {
          setLoading(false);
        }
      } else if (entry.name === "Overdue" && type === "overdue") {
        // Handle Overdue Drill-Down
        setLoading(true);
        setError(null);

        try {
          /* const drillDownResponse = await getOverdueTasksForEachSection({
            month: filters.month,
            year: filters.year,
            currency: filters.currency,
            departmentId: departmentId,
          }); */

          const drillDownResponse = await getOverdueTasksByDepartment({
            departmentId,
          });

          const drillDownFormattedData = drillDownResponse?.overdueTasks?.map(
            (section) => ({
              name: section.sectionName,
              value: section.percentageContribution,
            }),
          );

          setDrillDataOverdue((prev) => ({
            ...prev,
            [departmentId]: drillDownFormattedData,
          }));
          setSelectedCategoryOverdue((prev) => ({
            ...prev,
            [departmentId]: entry.name,
          }));
        } catch (err) {
          setError(
            `Failed to fetch overdue drill-down data for ${departmentId}. Please try again.`,
          );
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    },
    [filters],
  );

  const handleBackClick = (departmentId: string, type: string) => {
    if (type === "budget") {
      setDrillData((prev) => ({ ...prev, [departmentId]: [] }));
      setSelectedCategory((prev) => ({ ...prev, [departmentId]: null }));
    } else if (type === "overdue") {
      setDrillDataOverdue((prev) => ({ ...prev, [departmentId]: [] }));
      setSelectedCategoryOverdue((prev) => ({ ...prev, [departmentId]: null }));
    }
  };

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

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {data.departments.map((dept) => (
          <div
            key={dept.departmentId}
            className="rounded-lg bg-white p-6 shadow-md"
          >
            <h3 className="mb-4 text-lg font-bold">{dept.departmentName}</h3>

            {/* Overdue Tasks Pie Chart */}
            <div className="relative">
              <h4 className="mb-2 text-sm font-semibold">Overdue Tasks</h4>
              {selectedCategoryOverdue[dept.departmentId] && (
                <button
                  onClick={() => handleBackClick(dept.departmentId, "overdue")}
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
                      !selectedCategoryOverdue[dept.departmentId]
                        ? [
                            { name: "Overdue", value: dept.percentageOverdue },
                            {
                              name: "On Time",
                              value: 100 - dept.percentageOverdue,
                            },
                          ]
                        : drillDataOverdue[dept.departmentId]
                    }
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={65}
                    fill="#8884d8"
                    onClick={(e) =>
                      e.name === "Overdue" &&
                      !selectedCategoryOverdue[dept.departmentId] &&
                      handlePieClick(e, dept.departmentId, "overdue")
                    }
                    label={({ percent }) => formatPercentage(percent * 100)}
                  >
                    <Cell fill="#FF4560" />
                    <Cell fill="#00C49F" />
                  </Pie>
                  <Legend
                    layout="horizontal"
                    align="center"
                    verticalAlign="bottom"
                  />
                  <Tooltip
                    formatter={(value) => [
                      formatPercentage(value),
                      "Percentage",
                    ]}
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
