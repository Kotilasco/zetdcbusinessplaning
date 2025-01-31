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

export interface HeaderProps {
  kra: string;
  outcome: string;
  output: string;
  kraref: string;
  outcomeref: string;
  outputref: string;
}

export function Profit({ value, headerProps }: { value: string; headerProps: HeaderProps }) {
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
                rowSpan={1}
                className="border border-gray-300 bg-yellow-200 p-2 text-center text-sm font-semibold"
              >
                KRA1
              </th>
              <th
                colSpan={4}
                className="border border-gray-300 bg-white text-center text-sm font-semibold"
              >
                {headerProps.kra}
              </th>
              <th
                rowSpan={1}
                className="border border-gray-300 bg-yellow-200 p-2 text-center text-sm font-semibold"
              >
                KRA Ref
              </th>
              <th
                rowSpan={1}
                className="border border-gray-300 bg-white p-2 text-center text-sm font-semibold"
              >
                {headerProps.kraref}
              </th>
            </tr>
            <tr>
              <th
                rowSpan={1}
                className="border border-gray-300 bg-yellow-200 p-2 text-center text-sm font-semibold"
              >
                Outcome
              </th>
              <th
                colSpan={4}
                className="border border-gray-300 bg-white text-center text-sm font-semibold"
              >
                {headerProps.outcome}
              </th>
              <th
                rowSpan={1}
                className="border border-gray-300 bg-yellow-200 p-2 text-center text-sm font-semibold"
              >
                Outcome Ref
              </th>
              <th
                rowSpan={1}
                className="border border-gray-300 bg-white p-2 text-center text-sm font-semibold"
              >
                {headerProps.outcomeref}
              </th>
            </tr>
            <tr>
              <th
                rowSpan={1}
                className="border border-gray-300 bg-yellow-200 p-2 text-center text-sm font-semibold"
              >
                Output
              </th>
              <th
                colSpan={4}
                className="border border-gray-300 bg-white text-center text-sm font-semibold"
              >
                {headerProps.output}
              </th>
              <th
                rowSpan={1}
                className="border border-gray-300 bg-yellow-200 p-2 text-center text-sm font-semibold"
              >
                Output Ref.:
              </th>
              <th
                rowSpan={1}
                className="border border-gray-300 bg-white p-2 text-center text-sm font-semibold"
              >
                {headerProps.outputref}
              </th>
            </tr>

            {/* Column Headers */}
            <tr className="bg-blue-200 text-left">
              <th className="border border-gray-300 bg-blue-200 px-4 py-2 text-sm font-semibold">
                Output Progress Stage by Activity
              </th>
              <th className="border border-gray-300 bg-blue-200 px-4 py-2 text-sm font-semibold">
                Performance Progress Stages & Description{" "}
                <p className="text-xs">(Write Activity Title only)</p>
              </th>
              <th className="border border-gray-300 bg-blue-200 px-4 py-2 text-sm font-semibold">
                Actual Start Date
              </th>
              <th className="border border-gray-300 px-4 py-2 text-sm font-semibold">
                Actual Finish Date
              </th>
              <th className="border border-gray-300 px-4 py-2 text-sm font-semibold">
                Actual Expenditure $ (Where applicable)
              </th>
              <th className="border border-gray-300 px-4 py-2 text-sm font-semibold" colSpan={2}>
              Responsibility
                <p className="text-xs">
                  (Write name of responsible person: Extract from Work and
                  Performance Monitoring Plan)
                </p>
              </th>
            </tr>
          </thead>
          <Suspense fallback={<>Loading...</>}>
            <tbody>
              {/* Table Rows */}
              {data?.map((row, index) => (
                <tr
                  key={index}
                  className={index < 2 ? "bg-yellow-200" : "bg-white"}
                >
                  <td className="border border-gray-300 px-4 py-2">
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
                  <td className="border border-gray-300 px-4 py-2">
                    {row.expenditure}
                  </td>
                  <td className="border border-gray-300 px-4 py-2" colSpan={2}>
                    {row.responsibility}
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
