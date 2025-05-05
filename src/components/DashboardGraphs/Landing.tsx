//@ts-nocheck

"use client";

import { getDivisionSummary } from "@/app/actions/departmentWorkSummary";
import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const Landing = () => {
  const [filters, setFilters] = useState({
    month: "March",
    year: "2025",
    currency: "USD",
  });

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedData, setSelectedData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Function to handle pie slice click
  const handlePieClick = (data) => {
    setSelectedData(data);
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const COLORS = ["#00C49F", "#FFBB28", "#FF8042", "#FF4560", "#0088FE"];

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

  const handleFilterChange = (event: any) => {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">{error}</div>;
  }

  console.log(data);

  if (!data || !data?.departments) {
    return <div className="p-6 text-center">No data available.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
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
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
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
                <h4 className="mb-2 text-sm font-semibold">Budget Usage</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Used", value: dept.percentageBudget },
                        {
                          name: "Remaining",
                          value: 100 - dept.percentageBudget,
                        },
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      onClick={(event, data) => handlePieClick(data)}
                      label
                    >
                      <Cell fill="#00C49F" />
                      <Cell fill="#FF8042" />
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>

                {/* Inline Modal */}
                {isModalOpen && selectedData && (
                  <div
                    style={{
                      position: "fixed",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      background: "white",
                      padding: "20px",
                      boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
                      zIndex: 1000,
                      width: "400px", // Set modal width
                    }}
                  >
                    <button onClick={closeModal} style={{ float: "right" }}>
                      ❌
                    </button>
                    <h4>Details for {selectedData?.name}</h4>
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={[
                            {
                              name: "Subcategory A",
                              value: selectedData?.value / 2,
                            },
                            {
                              name: "Subcategory B",
                              value: selectedData?.value / 2,
                            },
                          ]}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#82ca9d"
                          dataKey="value"
                          label
                        >
                          <Cell fill="#FFBB28" />
                          <Cell fill="#FF8042" />
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
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

export default Landing;
