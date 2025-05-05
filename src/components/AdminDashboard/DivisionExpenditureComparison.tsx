//@ts-nocheck

"use client";

import { getDivisionComparison } from "@/app/actions/getDivisionComparisons";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function DivisionExpenditureComparison() {
  const now = new Date();

  // Get the current year
  const now_year = now.getFullYear();

  // Get the current month name
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const now_month = monthNames[now.getMonth()];

  const [filters, setFilters] = useState({
    month: now_month,
    year: now_year,
  });

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const COLORS = ["#00C49F", "#FFBB28", "#FF8042", "#FF4560", "#0088FE"];

  // Fetch data from the backend
  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Pass the filters to the getDivisionComparison function
      const response = await getDivisionComparison(filters);
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

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">{error}</div>;
  }

  // console.log(data);

  return (
    <div>
      <div className="mb-6 rounded-md p-4">
        <div className="flex space-x-4">
          {/* Month Filter */}
          <select
            name="month"
            value={filters.month}
            onChange={handleFilterChange}
            className="rounded border px-2 py-1"
          >
            <option value="January">January</option>
            <option value="February">February</option>
            <option value="March">March</option>
            <option value="April">April</option>
            <option value="May">May</option>
            <option value="June">June</option>
            <option value="July">July</option>
            <option value="August">August</option>
            <option value="September">September</option>
            <option value="October">October</option>
            <option value="November">November</option>
            <option value="December">December</option>
          </select>

          {/* Year Input Box */}
          <input
            type="text"
            name="year"
            value={filters.year}
            onChange={handleFilterChange}
            placeholder="Enter Year"
            className="rounded border px-2 py-1"
          />
        </div>
      </div>
      {!data || !data.weeklyData || data.weeklyData.length <= 0 ? (
        <div className="p-6 text-center">No data available.</div>
      ) : (
        <>
          {/* Budget Comparison */}
          <h2>Budget Comparison</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data?.weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="budgetUSD"
                stroke="#8884d8"
                name="Budget (USD)"
              />
              <Line
                type="monotone"
                dataKey="budgetZWG"
                stroke="#82ca9d"
                name="Budget (ZWG)"
              />
            </LineChart>
          </ResponsiveContainer>

          {/* Actual Comparison */}
          <h2>Actual Comparison</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data?.weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="budgetUSD"
                stroke="#8dd4d8"
                name="Budget (USD)"
              />
              <Line
                type="monotone"
                dataKey="actualUSD"
                stroke="#82ca9d"
                name="Actual (USD)"
              />
              <Line
                type="monotone"
                dataKey="budgetZWG"
                stroke="#8ff4d8"
                name="Budget (ZWG)"
              />
              <Line
                type="monotone"
                dataKey="actualZWG"
                stroke="#8cc4d8"
                name="Actual (ZWG)"
              />
            </LineChart>
          </ResponsiveContainer>

          {/* Difference Comparison */}
          <h2>Difference Comparison</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data?.weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="differenceUSD"
                stroke="#8884d8"
                name="Difference (USD)"
              />
              <Line
                type="monotone"
                dataKey="differenceZWG"
                stroke="#82ca9d"
                name="Difference (ZWG)"
              />
            </LineChart>
          </ResponsiveContainer>
        </>
      )}
    </div>
  );
}
