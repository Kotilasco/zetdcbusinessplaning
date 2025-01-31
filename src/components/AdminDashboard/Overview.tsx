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
import { Suspense } from 'react';

export function Overview({value}: {value: string}) {

  const [data, setData] = useState<ReportData[]>([]);
  console.log(value)
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
        <table className="table-auto border-collapse border border-gray-300 w-full text-sm">
          <thead>
            {/* Top Header Section */}
            <tr>
              <th
                rowSpan={1}
                className="border border-gray-300 bg-yellow-200 text-center font-semibold text-sm p-2"
              >
                KRA1
              </th>
              <th
                colSpan={3}
                className="border border-gray-300 bg-white text-center font-semibold text-sm"
              >
                Provision of Electricity
              </th>
              <th
                rowSpan={1}
                className="border border-gray-300 bg-yellow-200 text-center font-semibold text-sm p-2"
              >
                KRA Ref
              </th>
              <th
                rowSpan={1}
                className="border border-gray-300 bg-white text-center font-semibold text-sm p-2"
              >
                KRA1
              </th>
            </tr>
            <tr>
              <th
                rowSpan={1}
                className="border border-gray-300 bg-yellow-200 text-center font-semibold text-sm p-2"
              >
                Outcome
              </th>
              <th
                colSpan={3}
                className="border border-gray-300 bg-white text-center font-semibold text-sm"
              >
                Improved Client Service
              </th>
              <th
                rowSpan={1}
                className="border border-gray-300 bg-yellow-200 text-center font-semibold text-sm p-2"
              >
                Outcome Ref
              </th>
              <th
                rowSpan={1}
                className="border border-gray-300 bg-white text-center font-semibold text-sm p-2"
              >
                OC1
              </th>
            </tr>
            <tr>
              <th
                rowSpan={1}
                className="border border-gray-300 bg-yellow-200 text-center font-semibold text-sm p-2"
              >
                Output
              </th>
              <th
                colSpan={3}
                className="border border-gray-300 bg-white text-center font-semibold text-sm"
              >
                Power availability increased
              </th>
              <th
                rowSpan={1}
                className="border border-gray-300 bg-yellow-200 text-center font-semibold text-sm p-2"
              >
                Output Ref.:
              </th>
              <th
                rowSpan={1}
                className="border border-gray-300 bg-white text-center font-semibold text-sm p-2"
              >
                NHo1
              </th>
            </tr>

            {/* Column Headers */}
            <tr className="bg-blue-200 text-left">
              <th className="border border-gray-300 bg-blue-200 px-4 py-2 text-sm font-semibold">
                Output Progress Stage by Activity
              </th>
              <th className="border border-gray-300 bg-blue-200 px-4 py-2 text-sm font-semibold">
                Performance Progress Stages & Description
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
              <th className="border border-gray-300 px-4 py-2 text-sm font-semibold">
                Responsibility
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
                <td className="border border-gray-300 px-4 py-2">
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
