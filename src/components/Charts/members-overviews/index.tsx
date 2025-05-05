//@ts-nocheck

"use client";

import React, { useState } from "react";
import Chart from "react-apexcharts";

const TeamMembersBarChart = ({ data }: { data: any[] }) => {
  const options = {
    colors: ["#5750F1", "#0ABEF9", "#F77E53"],
    chart: { type: "bar", toolbar: { show: false }, stacked: true },
    xaxis: {
      categories: data.map((d) => d.lastname),
      title: {
        text: "Team Member Last Name", // X-Axis Label
        style: { fontSize: "14px", fontWeight: "bold" },
      },
    },
    yaxis: {
      title: {
        text: "Total Work Plans", // Y-Axis Label
        style: { fontSize: "14px", fontWeight: "bold" },
      },
    },
    legend: {
      position: "top",
      horizontalAlign: "left",
    },
  };

  const series = [
    { name: "Completed", data: data.map((d) => d.completed) },
    { name: "In Progress", data: data.map((d) => d.inProgress) },
    { name: "Overdue", data: data.map((d) => d.overdue) },
  ];

  return <Chart options={options} series={series} type="bar" height={370} />;
};

export default TeamMembersBarChart;
