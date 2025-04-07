//@ts-nocheck

"use client";

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
import { getDivisionComparison } from "../actions/getDivisionComparisons";

// Combine USD and ZWG data by week
const combinedData = [
  {
    week: "week1",
    budgetUSD: 4022,
    actualUSD: 470,
    differenceUSD: -3552,
    budgetZWG: 50982,
    actualZWG: 5940,
    differenceZWG: -45042,
  },
  {
    week: "week2",
    budgetUSD: 4680,
    actualUSD: 100,
    differenceUSD: -4580,
    budgetZWG: 59280,
    actualZWG: 1270,
    differenceZWG: -58010,
  },
  {
    week: "week3",
    budgetUSD: 7641,
    actualUSD: 3625,
    differenceUSD: -4016,
    budgetZWG: 96720,
    actualZWG: 45812,
    differenceZWG: -50908,
  },
  {
    week: "week4",
    budgetUSD: 8900,
    actualUSD: 5000,
    differenceUSD: -3900,
    budgetZWG: 110000,
    actualZWG: 60000,
    differenceZWG: -50000,
  },
];

export default function CurrencyComparisonGraphs() {
  const [filters, setFilters] = useState({
    month: "March",
    year: "2025",
    currency: "USD",
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
      const response = await getDivisionComparison({});
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

  if (!data || !data.weeklyData || data.weeklyData.length <= 0) {
    return <div className="p-6 text-center">No data available.</div>;
  }
  return (
    <div>
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
        <LineChart data={combinedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="week" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="actualUSD"
            stroke="#8884d8"
            name="Actual (USD)"
          />
          <Line
            type="monotone"
            dataKey="actualZWG"
            stroke="#82ca9d"
            name="Actual (ZWG)"
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Difference Comparison */}
      <h2>Difference Comparison</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={combinedData}>
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
    </div>
  );
}
