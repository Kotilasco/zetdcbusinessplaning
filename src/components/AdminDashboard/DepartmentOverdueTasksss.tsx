//@ts-nocheck

"use client";

import React, { useEffect, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getGroupedRowModel,
  flexRender,
} from "@tanstack/react-table";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css"; // Skeleton styles
import { getListOfOverdueTasks } from "@/app/actions/getOverdueTaskForDepartment"; // API call

const columns = [
  {
    accessorKey: "sectionName",
    header: "Section Name",
    enableGrouping: true,
  },
  {
    accessorKey: "scopeDetails",
    header: "Scope Details",
  },
  {
    accessorKey: "overdueDays",
    header: "Days Overdue",
    cell: (info) => info.getValue(), // Render overdue days as is
  },
  {
    accessorKey: "targetCompletionDate",
    header: "Target Completion Date",
    cell: (info) => {
      const date = new Date(info.getValue());
      return date.toLocaleDateString(); // Format the date
    },
  },
  {
    accessorKey: "teamMembers",
    header: "Team Members",
    cell: (info) => {
      const teamMembers = info.getValue();
      return Array.isArray(teamMembers)
        ? teamMembers.join(", ")
        : "No team members";
    },
  },
];

function OverdueTable() {
  const [data, setData] = useState([]); // Holds the fetched data
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await getListOfOverdueTasks("1"); // Replace "1" with the department ID
        setData(response || []); // Ensure response is an array
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Set up the React Table instance
  const table = useReactTable({
    data,
    columns,
    state: {
      grouping: ["sectionName"], // Group rows by "sectionName"
      expanded: true, // Expand all groups by default
    },
    getCoreRowModel: getCoreRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
  });

  console.log(table);

  return (
    <div className="p-4">
      <h1 className="mb-4 text-xl font-bold text-gray-700">
        Overdue Work Plans
      </h1>

      {/* Loading and Error States */}
      {isLoading ? (
        // Skeleton Loader
        <div>
          {[...Array(5)].map((_, index) => (
            <Skeleton
              key={index}
              height={30}
              className="mb-2"
              containerClassName="w-full"
            />
          ))}
        </div>
      ) : error ? (
        // Error Message
        <div className="text-red-500">{error}</div>
      ) : (
        // Table Content
        <div>
          <table id="data-table" className="w-full border border-gray-300">
            <thead className="bg-gray-100">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="border border-gray-300 p-2 text-left text-sm font-medium text-gray-600"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <React.Fragment key={row.id}>
                  {row.getIsGrouped() ? (
                    // Render group header
                    <tr>
                      <td
                        colSpan={columns.length}
                        className="bg-gray-200 px-4 py-2 font-bold"
                      >
                        {row.getValue("sectionName")}
                      </td>
                    </tr>
                  ) : (
                    // Render normal table rows (individual tasks)
                    <tr className={row.depth > 0 ? "bg-gray-50" : "bg-white"}>
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          className="border border-gray-300 px-4 py-2 text-sm"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </td>
                      ))}
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Export and Print Buttons */}
      <div className="mt-4 space-x-4">
        <button
          onClick={() => console.log("Export as PDF")}
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Export as PDF
        </button>
        <button
          onClick={() => console.log("Export as Excel")}
          className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
        >
          Export as Excel
        </button>
        <button
          onClick={() => console.log("Print Table")}
          className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
        >
          Print
        </button>
      </div>
    </div>
  );
}

export default OverdueTable;
