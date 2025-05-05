//@ts-nocheck

"use client";

import React, { useState } from "react";
import Chart from "react-apexcharts";

const ManagersBarChart = ({
  data,
  onBarClick,
}: {
  data: any[];
  onBarClick: (sectionId: number) => void;
}) => {
  const options = {
    colors: ["#0ABEF9", "#F77E53", "#FFBF00"], // Removed Total Work Plans color
    chart: {
      type: "bar",
      toolbar: { show: false },
      zoom: { enabled: false },
      stacked: true,
      events: {
        dataPointSelection: (event: any, chartContext: any, config: any) => {
          const sectionId = data[config.dataPointIndex].sectionId;
          onBarClick(sectionId);
        },
      },
    },
    annotations: {
      yaxis: data.map((d, index) => ({
        y: d.totalCount,
        label: {
          text: `Total: ${d.totalCount}`,
          style: { color: "#5750F1", fontSize: "12px", fontWeight: "bold" },
        },
      })),
    },
    xaxis: {
      categories: data.map((d) => d.managerLastname),
      title: {
        text: "Manager Last Name",
        style: { fontSize: "14px", fontWeight: "bold" },
      },
    },
    yaxis: {
      title: {
        text: "Work Plan Breakdown",
        style: { fontSize: "14px", fontWeight: "bold" },
      },
    },
    legend: {
      position: "top",
      horizontalAlign: "left",
      markers: { size: 9, shape: "circle" },
    },
  };

  const series = [
    { name: "Completed", data: data.map((d) => d.completed) },
    { name: "In Progress", data: data.map((d) => d.inProgress) },
    { name: "Overdue", data: data.map((d) => d.overdue) },
  ];

  return <Chart options={options} series={series} type="bar" height={370} />;
};

export default ManagersBarChart;
