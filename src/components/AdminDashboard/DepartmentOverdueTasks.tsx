//@ts-nocheck

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
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

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
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const tableRef = useRef(null);

  const exportAsPDF = () => {
    const doc = new jsPDF();
    doc.text("Overdue Work Plans", 14, 10);

    const table = document.getElementById("data-table");
    if (!table) {
      console.error("Table element not found!");
      return;
    }
    autoTable(doc, {
      html: table,
      startY: 20,
      styles: { overflow: "linebreak", cellPadding: 3 },
      columnStyles: {
        2: { cellWidth: 50 },
        3: { cellWidth: 70 },
      },
    });

    const fileName = `Overdue_WorkPlans_${new Date().toISOString().split("T")[0]}.pdf`;
    doc.save(fileName);
  };

  const exportAsExcel = () => {
    const table = tableRef.current;
    const workbook = XLSX.utils.table_to_book(table, { sheet: "WorkPlans" });
    const fileName = `Overdue_WorkPlans_${new Date().toISOString().split("T")[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

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
      pagination,
      grouping: ["sectionName"], // Re-add grouping
      expanded: true,
    },
    getCoreRowModel: getCoreRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    debugTable: false,
    onPaginationChange: setPagination,
  });

  const {
    getRowModel,
    gotoPage,
    canPreviousPage,
    canNextPage,
    previousPage,
    nextPage,
    pageCount,
    setPageSize,
  } = table;

  const page = getRowModel().rows; // Display all rows for now, adjust with pagination

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
            {page.map((row) => (
              <React.Fragment key={row.id}>
                {row.getIsGrouped() ? (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="bg-gray-200 px-4 py-2 font-bold"
                    >
                      {row.getValue("sectionName")}
                    </td>
                  </tr>
                ) : (
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
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
            className="rounded bg-gray-300 px-2 py-1 text-gray-700 hover:bg-gray-400"
          >
            Previous
          </button>
          <span>
            Page {pagination.pageIndex + 1} of {table.getPageCount()}
          </span>
          <button
            onClick={() => nextPage()}
            disabled={!canNextPage}
            className="rounded bg-gray-300 px-2 py-1 text-gray-700 hover:bg-gray-400"
          >
            Next
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <span>Rows per page:</span>
          <select
            value={pagination.pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
            }}
            className="rounded border border-gray-300 p-1 text-sm"
          >
            {[10, 20, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="mt-4 space-x-4">
        <button
          onClick={exportAsPDF}
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Export as PDF
        </button>
        <button
          onClick={exportAsExcel}
          className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
        >
          Export as Excel
        </button>
        <button
          onClick={handlePrint}
          className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
        >
          Print
        </button>
      </div>
    </div>
  );
}

export default OverdueTable;
