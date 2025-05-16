//@ts-nocheck

"use client";

import { getNumOfPlans } from "@/app/actions/getNumOfPlans";
import { getSectionsByDeptId } from "@/app/actions/getSectionsFromDepartment";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import React, { useEffect, useState } from "react";
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

// Predefined distinct color palette with 50 colors
const colorPalette = [
  "#FF5733",
  "#FFBD33",
  "#DBFF33",
  "#75FF33",
  "#33FF57",
  "#A3FF33",
  "#73FF33",
  "#33FF75",
  "#33FFAA",
  "#33FFDB",
  "#33B1DB",
  "#3375DB",
  "#3357DB",
  "#5733DB",
  "#BD33DB",
  "#FF33DB",
  "#FF33AA",
  "#FF3377",
  "#FF3357",
  "#FF3333",
];

const DynamicLineCharts = () => {
  const [sections, setSections] = useState([]); // List of assigned sections
  const [chartData, setChartData] = useState({}); // Chart data for each section

  const monthOrder = [
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

  // Fetch the `assignedSections` from the main endpoint
  useEffect(() => {
    const fetchSections = async () => {
      console.log("object");
      const response = await getSectionsByDeptId();
      setSections(response || []);
    };

    fetchSections();
  }, []);

  // Fetch data for each section ID
  useEffect(() => {
    const fetchSectionData = async () => {
      const dataMap = {}; // To store chart data for each section

      await Promise.all(
        sections.map(async (section) => {
          const response = await getNumOfPlans({
            sectionID: section.id,
            year: "2025",
          }); // Replace with your section endpoint

          // Prepare chart data in the required format
          const formattedData = [];
          response.forEach((member) => {
            Object.entries(member.monthlyCounts).forEach(([month, count]) => {
              const existingEntry = formattedData.find(
                (entry) => entry.month === month,
              );
              if (existingEntry) {
                existingEntry[member.memberName] = count;
              } else {
                formattedData.push({ month, [member.memberName]: count });
              }
            });
          });

          // Fill missing values with 0
          formattedData.forEach((entry) => {
            response.forEach((member) => {
              if (!entry[member.memberName]) {
                entry[member.memberName] = 0;
              }
            });
          });
          // Sort the data by month
          const sortedChartData = formattedData.sort(
            (a, b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month),
          );
          // Store the formatted data for this section
          dataMap[section.name] = sortedChartData;
        }),
      );

      setChartData(dataMap);
    };

    if (sections.length > 0) {
      fetchSectionData();
    }
  }, [sections]);

  console.log(sections);

  return (
    <DefaultLayout>
      {sections.map((section, index) => (
        <div key={section.id} style={{ marginBottom: "50px" }}>
          <h2>{section.name}</h2>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData[section.name] || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              {chartData[section.name] &&
                chartData[section.name][0] &&
                Object.keys(chartData[section.name][0])
                  .filter((key) => key !== "month")
                  .map((memberName, idx) => (
                    <Line
                      key={memberName}
                      type="monotone"
                      dataKey={memberName}
                      stroke={colorPalette[idx % colorPalette.length]} // Assign color dynamically
                      activeDot={{ r: 8 }}
                    />
                  ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      ))}
    </DefaultLayout>
  );
};

export default DynamicLineCharts;
