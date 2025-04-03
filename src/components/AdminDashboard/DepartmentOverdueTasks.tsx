//@ts-nocheck

"use client";

import React, { useEffect, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getGroupedRowModel,
  flexRender,
} from "@tanstack/react-table";
import { getOverdueTasksByDepartment } from "@/app/actions/getOverdueTasksByDepartment";
import { getListOfOverdueTasks } from "@/app/actions/getOverdueTaskForDepartment";

/* const data = [
  {
    departmentName: "Information Technology",
    sectionName: "IT Governance",
    scopeDetails: "BI development",
    workPlanId: 1,
    targetCompletionDate: "2025-02-01",
    overdueDays: 51,
    teamMembers: ["Farai Makova"],
  },
  {
    departmentName: "Information Technology",
    sectionName: "IT Governance",
    scopeDetails: "Customer Relationship Management (CRM) enhancements",
    workPlanId: 2,
    targetCompletionDate: "2024-03-31",
    overdueDays: 358,
    teamMembers: ["Nyasha Chikobvore", "Knowledge Kwaramba", "Kudakwashe Koti"],
  },
  {
    departmentName: "Information Technology",
    sectionName: "Commercial",
    scopeDetails: "Third Party Fiscalisation Progress",
    workPlanId: 10,
    targetCompletionDate: "2024-02-27",
    overdueDays: 391,
    teamMembers: [
      "Nigel Musiyarira",
      "Marshal Charindapanze",
      "Tatenda Chakawa",
    ],
  },
  {
    departmentName: "Information Technology",
    sectionName: "Hardware and Operations",
    scopeDetails: "Office Automation User Support",
    workPlanId: 24,
    targetCompletionDate: "2024-01-31",
    overdueDays: 418,
    teamMembers: ["Simbarashe Chimbwe", "Takudzwa Marara"],
  },
  // Add more entries as needed
]; */

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
  },
  {
    accessorKey: "targetCompletionDate",
    header: "Target Completion Date",
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
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getListOfOverdueTasks("1");

        setData(response);
      } catch (error: any) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  const table = useReactTable({
    data,
    columns,
    state: {
      grouping: ["sectionName"], // Group by sectionName
      expanded: true,
    },
    getCoreRowModel: getCoreRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
  });

  return (
    <div className="p-4">
      <h1 className="mb-4 text-xl font-bold text-gray-700">
        Overdue Work Plans
      </h1>
      <table className="w-full border border-gray-300">
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
                // Render the group header (e.g., "Commercial", "Hardware and Operations")
                <tr>
                  <td
                    colSpan={columns.length}
                    className="bg-gray-200 px-4 py-2 font-bold"
                  >
                    {row.getValue("sectionName")} {/* Group name */}
                  </td>
                </tr>
              ) : (
                // Render individual rows (child rows within the group)
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

              {/* Render subRows for grouped rows explicitly */}
              {row.subRows &&
                row.subRows.map((subRow) => (
                  <tr key={subRow.id} className="bg-gray-50">
                    {subRow.getVisibleCells().map((cell) => (
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
                ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OverdueTable;
