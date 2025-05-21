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
import { getBudgetUsageForEachSection } from "@/app/actions/budgetUsageForEachSection";
import { getOverdueTasksByDepartment } from "@/app/actions/getOverdueTasksByDepartment";
import { getStatusContribution } from "@/app/actions/getStatusContribution";

const COLORS = [
  "#0088FE", // Bright Blue
  "#00C49F", // Teal/Green
  "#FFBB28", // Orange-Yellow
  "#FF8042", // Orange-Red
  "#A28DFF", // Lavender/Light Purple
  "#FF6F91", // Pink
  "#8884d8", // Medium Purple (similar to the default Recharts fill, but distinct from A28DFF)
  "#D0ED57", // Light Green/Lime
  "#FF4560", // Vivid Red
  "#4CAF50", // Darker Green (or a strong distinct green)
];

const DonutChart = () => {
  const [drillData, setDrillData] = useState({}); // Store drill-down data per department
  const [selectedCategory, setSelectedCategory] = useState({}); // Track selected category per department
  const [drillDataOverdue, setDrillDataOverdue] = useState({});
  const [drillTaskData, setDrillTaskData] = useState({});
  const [selectedCategoryOverdue, setSelectedCategoryOverdue] = useState({});
  const [selectedTaskCategory, setSelectedTaskCategory] = useState({});
  const [filters, setFilters] = useState({
    month: "March",
    year: "2025",
    currency: "USD",
  });
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Define your color palette outside the component or at the top of the file
  const DEPARTMENT_CARD_COLORS = [
    "bg-blue-100", // Light Blue
    "bg-green-100", // Light Green
    "bg-yellow-100", // Light Yellow
    "bg-purple-100", // Light Purple
    "bg-indigo-100", // Light Indigo
    // Add more as needed to ensure enough variety for your departments
  ];

  let allowedTaskSlices = ["Complete", "Pending", "In Progress", "Cancelled"];

  const handleFilterChange = (event: any) => {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handlePieClick = useCallback(
    async (entry: any, departmentId: string) => {
      if (entry.name === "Used") {
        setLoading(true);
        setError(null);

        try {
          const drillDownResponse = await getBudgetUsageForEachSection({
            month: filters.month,
            year: filters.year,
            currency: filters.currency,
            departmentId: departmentId,
          });
          console.log(
            `Drill-Down Data for ${departmentId}:`,
            drillDownResponse,
          );

          const drillDownFormattedData = drillDownResponse.map((section) => ({
            name: section.sectionName,
            value: section.percentageUsage,
          }));

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
      }
    },
    [
      filters,
      getBudgetUsageForEachSection,
      setLoading,
      setError,
      setDrillData,
      setSelectedCategory,
    ],
  );

  const handleOverDuePieClick = useCallback(
    async (entry: any, departmentId: string, type: string) => {
      if (entry.name === "Used" && type === "budget") {
        // Handle Budget Drill-Down
        setLoading(true);
        setError(null);

        try {
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

  const handleTaskPieClick = useCallback(
    async (entry: any, departmentId: string, type: string) => {
      console.log(entry);
      console.log(type);
      console.log(allowedTaskSlices.includes(entry.name) && type === "task");
      console.log(filters.year, filters.month, departmentId);
      if (allowedTaskSlices.includes(entry.name) && type === "task") {
        // Handle Budget Drill-Down
        setLoading(true);
        setError(null);

        console.log("hh ffher fdnjfjhfr");

        try {
          console.log("kkkkkk");
          const drillDownResponse = await getStatusContribution({
            year: filters.year,
            month: filters.month,
            status: entry.name,
            departmentId,
          });

          console.log(drillDownResponse);

          const drillDownFormattedData = drillDownResponse?.map((section) => ({
            name: section.sectionName,
            value: section.percentage,
          }));

          console.log(drillDownFormattedData);

          setDrillTaskData((prev) => ({
            ...prev,
            [departmentId]: drillDownFormattedData,
          }));
          setSelectedTaskCategory((prev) => ({
            ...prev,
            [departmentId]: entry.name,
          }));

          console.log("mmnn mmnn mnnmm");
        } catch (err) {
          setError(
            `Failed to fetch drill-down data for ${departmentId}. Please try again.`,
          );
          console.error(err);
        } finally {
          setLoading(false);
        }
      } /*  else if (entry.name === "Overdue" && type === "overdue") {
        // Handle Overdue Drill-Down
        setLoading(true);
        setError(null);

        try {
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
      } */
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
    } else if (type === "task") {
      setDrillTaskData((prev) => ({ ...prev, [departmentId]: [] }));
      setSelectedTaskCategory((prev) => ({ ...prev, [departmentId]: null }));
    }
  };

  /*  const handleBackClick = (departmentId: string) => {
    setDrillData((prev) => ({ ...prev, [departmentId]: [] }));
    setSelectedCategory((prev) => ({ ...prev, [departmentId]: null }));
  }; */

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getDivisionSummary({
        month: filters.month,
        year: filters.year,
        currency: filters.currency,
      });
      console.log("Main Data:", response);
      setData(response);
    } catch (err) {
      setError("Failed to fetch data. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [filters, getDivisionSummary, setLoading, setError, setData]);

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
    <div className="min-h-screen bg-white p-6">
      {loading && <div className="text-center">Loading...</div>}
      {error && <div className="text-center text-red-500">{error}</div>}

      {/* Filters Section */}
      <div className="mb-6 flex flex-wrap gap-4">
        {/* ... (Your filter controls) ... */}
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

      {/* Cards Section */}
      {/*   <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {data.departments.map((dept) => (
          <div
            key={dept.departmentId}
            className="rounded-lg bg-white p-6 shadow-md"
          >
            <h3 className="mb-4 text-lg font-bold">{dept.departmentName}</h3>

            
            <div className="grid grid-cols-1 gap-6">
              
              <div className="relative">
                <h4 className="mb-2 text-sm font-semibold">Budget Usage</h4>
               
                {selectedCategory[dept.departmentId] && (
                  <button
                    onClick={() => handleBackClick(dept.departmentId, "budget")}
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
                        !selectedCategory[dept.departmentId]
                          ? [
                              { name: "Used", value: dept.percentageBudget },
                              {
                                name: "Remaining",
                                value: 100 - dept.percentageBudget,
                              },
                            ]
                          : drillData[dept.departmentId]
                      }
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={65}
                      fill="#8884d8"
                      onClick={(e) =>
                        e.name === "Used" && // Only allow click on "Used" slice
                        !selectedCategory[dept.departmentId] &&
                        handlePieClick(e, dept.departmentId)
                      }
                      label={({ percent }) => formatPercentage(percent * 100)}
                    >
                      {!selectedCategory[dept.departmentId]
                        ? [
                            { name: "Used", value: dept.percentageBudget },
                            {
                              name: "Remaining",
                              value: 100 - dept.percentageBudget,
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

               
              <div className="relative">
                <h4 className="mb-2 text-sm font-semibold">Task Progress</h4>
                {selectedTaskCategory[dept.departmentId] && (
                  <button
                    onClick={() => handleBackClick(dept.departmentId, "task")}
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
                              {
                                name: "Pending",
                                value: dept.percentagePending,
                              },
                              {
                                name: "In Progress",
                                value: dept.percentageInProgress,
                              },
                              {
                                name: "Cancelled",
                                value: dept.percentageCancelled,
                              },
                            ]
                          : drillTaskData[dept.departmentId]
                      }
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={65}
                      fill="#8884d8"
                      dataKey="value"
                      onClick={(e) =>
                        allowedTaskSlices.includes(e.name) &&
                        !selectedTaskCategory[dept.departmentId] &&
                        handleTaskPieClick(e, dept.departmentId, "task")
                      }
                      label={({ percent }) => formatPercentage(percent * 100)}
                    >
                      {COLORS.map((color, index) => (
                        <Cell key={`cell-${index}`} fill={color} />
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

              
              <div className="relative">
                <h4 className="mb-2 text-sm font-semibold">Overdue Tasks</h4>
                {selectedCategoryOverdue[dept.departmentId] && (
                  <button
                    onClick={() =>
                      handleBackClick(dept.departmentId, "overdue")
                    }
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
                              {
                                name: "Overdue",
                                value: dept.percentageOverdue,
                              },
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
                        handleOverDuePieClick(e, dept.departmentId, "overdue")
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
          </div>
        ))}
      </div> */}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {data.departments.map((dept, index) => (
          <div
            key={dept.departmentId}
            // Dynamically apply a background color
            className={`rounded-lg p-6 shadow-md ${DEPARTMENT_CARD_COLORS[index % DEPARTMENT_CARD_COLORS.length]}`}
          >
            <h3 className="mb-4 text-lg font-bold">{dept.departmentName}</h3>

            {/* Charts Section */}
            <div className="grid grid-cols-1 gap-6">
              {/* Budget Usage Pie Chart */}
              <div className="relative">
                <h4 className="mb-2 text-sm font-semibold">Budget Usage</h4>
                {/* Back Button */}
                {selectedCategory[dept.departmentId] && (
                  <button
                    onClick={() => handleBackClick(dept.departmentId, "budget")}
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
                        !selectedCategory[dept.departmentId]
                          ? [
                              { name: "Used", value: dept.percentageBudget },
                              {
                                name: "Remaining",
                                value: 100 - dept.percentageBudget,
                              },
                            ]
                          : drillData[dept.departmentId]
                      }
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={65}
                      // This fill prop on Pie will be overridden by Cell fills if they exist
                      fill="#8884d8"
                      onClick={(e) =>
                        e.name === "Used" && // Only allow click on "Used" slice
                        !selectedCategory[dept.departmentId] &&
                        handlePieClick(e, dept.departmentId)
                      }
                      label={({ percent }) => formatPercentage(percent * 100)}
                    >
                      {/* These Cells control the slice colors */}
                      {!selectedCategory[dept.departmentId]
                        ? [
                            { name: "Used", value: dept.percentageBudget },
                            {
                              name: "Remaining",
                              value: 100 - dept.percentageBudget,
                            },
                          ].map(
                            (
                              entry,
                              idx, // Changed index to idx to avoid conflict with outer loop index
                            ) => (
                              <Cell
                                key={`budget-cell-${idx}`}
                                fill={COLORS[idx % COLORS.length]}
                              />
                            ),
                          )
                        : drillData[dept.departmentId]?.map(
                            (
                              entry,
                              idx, // Changed index to idx
                            ) => (
                              <Cell
                                key={`budget-drill-cell-${idx}`}
                                fill={COLORS[idx % COLORS.length]}
                              />
                            ),
                          )}
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

              {/* Task Progress Pie Chart */}
              <div className="relative">
                <h4 className="mb-2 text-sm font-semibold">Task Progress</h4>
                {selectedTaskCategory[dept.departmentId] && (
                  <button
                    onClick={() => handleBackClick(dept.departmentId, "task")}
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
                              {
                                name: "Pending",
                                value: dept.percentagePending,
                              },
                              {
                                name: "In Progress",
                                value: dept.percentageInProgress,
                              },
                              {
                                name: "Cancelled",
                                value: dept.percentageCancelled,
                              },
                            ]
                          : drillTaskData[dept.departmentId]
                      }
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={65}
                      fill="#8884d8"
                      dataKey="value"
                      onClick={(e) =>
                        allowedTaskSlices.includes(e.name) &&
                        !selectedTaskCategory[dept.departmentId] &&
                        handleTaskPieClick(e, dept.departmentId, "task")
                      }
                      label={({ percent }) => formatPercentage(percent * 100)}
                    >
                      {/* Using the same COLORS array for slices here */}
                      {/* Ensure COLORS has enough distinct values for all possible slices */}
                      {COLORS.map(
                        (
                          color,
                          idx, // Changed index to idx
                        ) => (
                          <Cell key={`task-cell-${idx}`} fill={color} />
                        ),
                      )}
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

              {/* Overdue Tasks Pie Chart */}
              <div className="relative">
                <h4 className="mb-2 text-sm font-semibold">Overdue Tasks</h4>
                {selectedCategoryOverdue[dept.departmentId] && (
                  <button
                    onClick={() =>
                      handleBackClick(dept.departmentId, "overdue")
                    }
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
                              {
                                name: "Overdue",
                                value: dept.percentageOverdue,
                              },
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
                        handleOverDuePieClick(e, dept.departmentId, "overdue")
                      }
                      label={({ percent }) => formatPercentage(percent * 100)}
                    >
                      {/* You've hardcoded colors here. If you want to use the dynamic COLORS array, do this: */}
                      {/*
                    (
                      !selectedCategoryOverdue[dept.departmentId]
                        ? [
                            { name: "Overdue", value: dept.percentageOverdue },
                            { name: "On Time", value: 100 - dept.percentageOverdue },
                          ]
                        : drillDataOverdue[dept.departmentId]
                    ).map((entry, idx) => (
                      <Cell key={`overdue-cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                    ))
                    */}
                      {/* For now, keeping your hardcoded ones as they are specific to overdue/on time */}
                      <Cell fill="#FF4560" /> {/* Red for Overdue */}
                      <Cell fill="#00C49F" /> {/* Green for On Time */}
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default DonutChart;
