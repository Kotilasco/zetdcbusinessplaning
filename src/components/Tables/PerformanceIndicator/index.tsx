"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

/* const data = [
  {
    outputStage: "1",
    description: "Output not commenced",
    startDate: "",
    finishDate: "",
    expenditure: "",
    responsibility: "",
  },
  {
    outputStage: "2",
    description: "Preparatory Actions",
    startDate: "",
    finishDate: "",
    expenditure: "",
    responsibility: "",
  },
  {
    outputStage: "Act 1",
    description: "CT Upgrades",
    startDate: "",
    finishDate: "",
    expenditure: "",
    responsibility: "Harare Region",
  },
  {
    outputStage: "Act 2",
    description:
      "Relocate 20MVA, 88KV Txf from Hwange Local to Vic Falls 88kv Sub",
    startDate: "January 2018",
    finishDate: "",
    expenditure: "USD 100 000",
    responsibility: "Regional Transmission West",
  },
  {
    outputStage: "Act 3",
    description:
      "Replace Ncema-Mzinyathini ‘H’ wood poles with steel monopole towers",
    startDate: "January 2015",
    finishDate: "",
    expenditure: "USD 300 000",
    responsibility: "Regional Transmission West",
  },
  {
    outputStage: "Act 4",
    description: "Commission ZIMPLATS 40MW Solar Plant",
    startDate: "Jan 2024",
    finishDate: "",
    expenditure: "",
    responsibility: "SMETO",
  },
  {
    outputStage: "Act 5",
    description: "Commission T&D Solar 40MW Plant",
    startDate: "Jan 2024",
    finishDate: "",
    expenditure: "",
    responsibility: "SMETO",
  },
  {
      outputStage: "Act 5",
      description: "Commission T&D Solar 40MW Plant",
      startDate: "Jan 2024",
      finishDate: "",
      expenditure: "",
      responsibility: "SMETO",
    },
]; */

import { useState, useEffect } from "react";
import { ReportData } from "@/app/api/reports/monthly/[value]/route";
import { Suspense } from "react";

export function PerformanceIndicator({ value }: { value: string }) {
  const [data, setData] = useState<ReportData[]>([]);
  console.log(value);
  const API_URL = `/api/reports/weekly`; // Replace with your actual API endpoint

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`${API_URL}/${value}`);

      const fetchedData = await response.json();

      setData(fetchedData?.data || []);
    };

    fetchData();
  }, [value]); // Dependency array ensures fetch happens only when value changes

  return (
    <ResponsiveContainer width="100%" height={350}>
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse border border-gray-300 text-sm">
          <thead>
            {/* Top Header Section */}
            <tr>
              <th
                colSpan={3}
                className="border border-gray-300 bg-yellow-200 p-2 text-center text-sm font-semibold"
              >
                Performance Indicator
              </th>
              <th className="border border-gray-300 bg-white text-center text-sm font-semibold">
                Month
              </th>
              <th className="border border-gray-300 bg-yellow-200 p-2 text-center text-sm font-semibold">
                Quarter
              </th>
              <th className="border border-gray-300 bg-white p-2 text-center text-sm font-semibold">
                YTD
              </th>
            </tr>
          </thead>
          <Suspense fallback={<>Loading...</>}>
            <tbody>
              {/* Table Rows */}
              {data?.map((row, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 px-4 py-2" colSpan={3}>
                    {row.outputStage}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {row.description}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {row.startDate}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {row.finishDate}
                  </td>
                </tr>
              ))}
            </tbody>
          </Suspense>
        </table>
      </div>
    </ResponsiveContainer>
  );
}
