"use client";

import { compactFormat } from "@/lib/format-number";
import type { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

/* 
 sectionName: 'IT Governance',
        percentageContribution: 23.81,
        sectionId: 1,
        overdueCount: 10
*/
type PropsType = {
  data: {
    sectionName: string;
    percentageContribution: number;
    sectionId: number;
    overdueCount: number;
  }[];
};

const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

/* 
 sectionName: 'IT Governance',
        percentageContribution: 23.81,
        sectionId: 1,
        overdueCount: 10
*/

export function DonutChart({ data }: PropsType) {
  console.log("d", data);
  const chartOptions: ApexOptions = {
    chart: {
      type: "donut",
      fontFamily: "inherit",
    },
    colors: ["#5750F1", "#5475E5", "#8099EC", "#ADBCF2"],
    labels: data?.map((item) => item?.sectionName) || [],
    legend: {
      show: true,
      position: "bottom",
      itemMargin: {
        horizontal: 10,
        vertical: 5,
      },
      formatter: (legendName, opts) => {
        const { seriesPercent } = opts.w.globals;
        return `${legendName}: ${seriesPercent[opts.seriesIndex]}%`;
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: "80%",
          background: "transparent",
          labels: {
            show: true,
            total: {
              show: true,
              showAlways: true,
              label: "Overdue Tasks",
              fontSize: "16px",
              fontWeight: "400",
            },
            value: {
              show: true,
              fontSize: "28px",
              fontWeight: "bold",
              formatter: (val) => compactFormat(+val),
            },
          },
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    responsive: [
      {
        breakpoint: 2600,
        options: {
          chart: {
            width: 415,
          },
        },
      },
      {
        breakpoint: 640,
        options: {
          chart: {
            width: "100%",
          },
        },
      },
      {
        breakpoint: 370,
        options: {
          chart: {
            width: 260,
          },
        },
      },
    ],
  };

  return (
    <Chart
      options={chartOptions}
      series={data?.map((item) => item?.overdueCount) || []}
      type="donut"
    />
  );
}
