//@ts-nocheck

"use client";

import React, { useEffect, useRef, useState } from "react";
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

  // Table reference for printing
  const tableRef = useRef(null);

  // Export table as PDF
  const exportAsPDF = () => {
    const doc = new jsPDF();
    doc.text("Overdue Work Plans", 14, 10);

    // Use jsPDF's autoTable plugin to generate a table
    /*  autoTable(doc, {
        html: tableRef.current,
        startY: 20,
        theme: "grid", // Apply a grid style
        headStyles: { fillColor: [0, 102, 204] }, // Change header color
        margin: { top: 20 },
      }); */
    const table = document.getElementById("data-table"); // Reference the table by ID
    if (!table) {
      console.error("Table element not found!");
      return; // Stop execution if the table is missing
    }
    autoTable(doc, {
      html: table,
      startY: 20,
      styles: { overflow: "linebreak", cellPadding: 3 }, // Wrap long text
      columnStyles: {
        2: { cellWidth: 50 }, // Adjust column width for "Scope"
        3: { cellWidth: 70 }, // Adjust column width for "Team Members"
      },
    });

    // Save the PDF
    const fileName = `Overdue_WorkPlans_${new Date().toISOString().split("T")[0]}.pdf`;
    doc.save(fileName);
  };

  // Export table as Excel
  const exportAsExcel = () => {
    const table = /* document.getElementById("data-table"); */ tableRef.current;
    const workbook = XLSX.utils.table_to_book(table, { sheet: "WorkPlans" });
    const fileName = `Overdue_WorkPlans_${new Date().toISOString().split("T")[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
    // XLSX.writeFile(workbook, "WorkPlans.xlsx");
  };

  // Print the table
  const handlePrint = () => {
    const tableHTML = tableRef.current.outerHTML;

    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
        <html>
          <head>
            <title>Work Plans</title>
            <style>
              table {
                width: 100%;
                border-collapse: collapse;
              }
              th, td {
                border: 1px solid black;
                padding: 8px;
                text-align: left;
              }
              th {
                background-color: black;
                color: white;
              }
            </style>
          </head>
          <body>
            <h1>Work Plans</h1>
            ${tableHTML}
          </body>
        </html>
      `);
    printWindow.document.close();
    printWindow.print();
  };

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
      <div ref={tableRef}>
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
      <div className="mt-4 space-x-4">
        <button
          onClick={exportAsPDF}
          /* disabled={isLoading} */
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Export as PDF
        </button>
        <button
          onClick={exportAsExcel}
          /* disabled={isLoading} */
          className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
        >
          Export as Excel
        </button>
        <button
          onClick={handlePrint}
         /*  disabled={isLoading} */
          className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
        >
          Print
        </button>
      </div>
    </div>
  );
}

export default OverdueTable;
