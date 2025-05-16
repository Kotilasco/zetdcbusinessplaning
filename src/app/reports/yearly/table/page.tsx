//@ts-nocheck
"use client";

import React, { useState, useEffect, useTransition, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { MONTHS, WEEKS } from "@/data/constants";
import { Delete, Pencil, PlusIcon, TimerResetIcon } from "lucide-react";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import { getAllWorkPlans } from "@/app/actions/getWorkPlans";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { updateWeeklyReport } from "@/app/actions/updateWeeklyReport";
import { getAllWorkPlansFilter } from "@/app/actions/getWorkPlansFilter";
import { hasPermission } from "@/permissions";
import { currentRole } from "@/lib/auth";
import { useCurrentRole } from "@/hooks/use-current-role";
import { getWorkplansForYearAndQuarterByStatus } from "@/app/actions/getWorkplansForYearAndQuarterByStatus";
import { getSectionNameById } from "@/app/actions/getSectionsFromDepartment";

interface YearlyTableProps {
  year: string;
  status: string;
  quarter: string;
}

const YearReport: React.FC<YearlyTableProps> = ({ year, quarter, status }) => {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Number of rows per page

  // Calculate total pages
  const totalPages = Math.ceil((reports?.length || 0) / itemsPerPage);

  // Get the data for the current page
  const paginatedReports = reports?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Handle page change
  const changePage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const role = useCurrentRole();

  // Table reference for printing
  const tableRef = useRef(null);

  // Export table as PDF
  /* const exportAsPDF = () => {
    const doc = new jsPDF();
    // Add logo
    const logoUrl = "/images/logo/zetdc.png"; // Your logo file in public folder or external URL
    const img = new Image();
    img.src = logoUrl;
    img.onload = () => {
      doc.addImage(img, "PNG", 10, 5, 30, 30); // Position (x, y) and size (width, height)

      // Add a header after the logo
      doc.setFontSize(18);
      doc.text(
        `Report For Quarter ${quarter} of ${year} for ${status} tasks`,
        50,
        20,
      ); // Adjust x and y position

      doc.setFontSize(14);
      // doc.text(`Section: ${section?.name}`, 50, 30); // Adjust x and y position

      // Draw a line under the header
      doc.line(10, 35, 200, 35); // From (x1, y1) to (x2, y2)

      const table = document.getElementById("data-table");
      if (!table) {
        console.error("Table element not found!");
        return;
      }

      // Extract headers excluding "Actions"
      const headers = [...table.querySelectorAll("th")]
        .filter((header) => header.innerText.trim() !== "Actions")
        .map((header) => header.innerText);

      // Extract row data excluding "Actions"
      const rows = [...table.querySelectorAll("tr")].map((row) =>
        [...row.querySelectorAll("td")]
          .filter((cell) => cell.cellIndex !== 8) // Adjust index if needed
          .map((cell) => cell.innerText),
      );

      autoTable(doc, {
        head: [headers],
        body: rows.filter((row) => row.length > 0),
        startY: 40,
      });

      const timestamp = new Date().toISOString().replace(/[-:.]/g, "");
      doc.save(`WorkPlans_${timestamp}.pdf`);
    };
  }; */

  // Export table as PDF
  const exportAsPDF = async () => {
    const doc = new jsPDF();

    // Add logo
    const logoUrl = "/images/logo/zetdc.png"; // Your logo file
    const img = new Image();
    img.src = logoUrl;

    img.onload = async () => {
      doc.addImage(img, "PNG", 10, 5, 30, 30); // Position (x, y) and size (width, height)

      // Add a header after the logo
      doc.setFontSize(18);
      doc.setFont("Algerian", "bold");
      doc.text(
        `Report For Quarter ${quarter} of ${year} for ${status} tasks`,
        50,
        20,
      ); // Adjust x and y position

      // Draw a line under the header
      doc.line(10, 35, 200, 35); // From (x1, y1) to (x2, y2)

      // Group data by sectionId
      const groupedReports = reports.reduce((acc, report) => {
        const sectionId = report.sectionId;
        if (!acc[sectionId]) {
          acc[sectionId] = [];
        }
        acc[sectionId].push(report);
        return acc;
      }, {});

      let startY = 40; // Initial Y position for the table

      // Fetch section names for each sectionId
      const sectionNames = await Promise.all(
        Object.keys(groupedReports).map(async (sectionId) => ({
          sectionId,
          name: await getSectionNameById(sectionId),
        })),
      );

      // Create a map of sectionId to sectionName for quick lookup
      const sectionNameMap = sectionNames.reduce((acc, { sectionId, name }) => {
        acc[sectionId] = name;
        return acc;
      }, {});

      // Iterate over grouped data and add each section's table
      Object.keys(groupedReports).forEach((sectionId, index) => {
        const sectionReports = groupedReports[sectionId];

        // Add section header
        const sectionName = sectionNameMap[sectionId] || `Section ${sectionId}`;
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text(sectionName, 10, startY); // Use fetched section name
        startY += 10;

        // Add the table for this section
        autoTable(doc, {
          head: [
            [
              "Activity",
              "Weekly Target",
              "Actual Work Done",
              "Team Members",
              "Percentage Complete",
              "Actual Expenditure",
              "% of Budget",
              "Remarks",
            ],
          ],
          body: sectionReports.map((report) => [
            report.scopes?.map((scope) => scope.details).join(", "),
            report.weeklyTarget,
            report.actualWorkDone,
            report.scopes
              ?.flatMap((scope) =>
                scope.assignedTeamMembers?.map(
                  (member) => `${member.firstname} ${member.lastname}`,
                ),
              )
              .join(", "),
            `${report.percentageComplete.toFixed(2)}%`,
            `${report.actualExpenditure} ${report.currency}`,
            `${report.percentOfBudget?.toFixed(2)}%`,
            report.remarks,
          ]),
          startY,
          styles: { overflow: "linebreak", cellPadding: 3 },
          columnStyles: {
            0: { halign: "left" },
            1: { halign: "center" },
            2: { halign: "right" },
          },
          didParseCell: function (data) {
            if (data.column.index === 8) {
              // Assuming "Actions" is the last column
              data.cell.styles.fillColor = [255, 255, 255]; // Hide by setting white background
              data.cell.text = ""; // Remove text
            }
          },
        });

        // Adjust startY for the next section
        startY = doc.lastAutoTable.finalY + 15; // Add spacing between tables
      });

      // Save the PDF
      const fileName = `Yearly_WorkPlans_${new Date().toISOString()}.pdf`;
      doc.save(fileName);
    };
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
    setIsLoading(true);
    const fetchData = async () => {
      try {
        const response = await getWorkplansForYearAndQuarterByStatus({
          year,
          quarter,
          status,
        });
        // console.log(response);
        setReports(response);
      } catch (error: any) {
        console.log("");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [year, quarter]);

  // console.log(reports);

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">Year Report</h1>
      <div className="no-scrollbar overflow-x-auto" ref={tableRef}>
        {/* <table
          id="data-table"
          className="w-full border-collapse border border-gray-300"
        >
          <thead className="bg-black text-white">
            <tr>
              <th className="border p-2">Activity</th>
              <th className="border p-2">Weekly Target</th>
              <th className="border p-2">Actual Work Done</th>
              <th className="border p-2">Team Members</th>
              <th className="border p-2">Percentage Complete</th>
              <th className="border p-2">Actual Expenditure</th>
              <th className="border p-2">% of Budget</th>
              <th className="border p-2">Remarks</th>
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? // Display skeleton loader rows
                Array.from({ length: 5 }).map((_, index) => (
                  <tr key={index} className="border">
                    <td className="border p-2">
                      <div className="skeleton-loader h-4 w-full animate-pulse bg-gray-200"></div>
                    </td>
                    <td className="border p-2">
                      <div className="skeleton-loader h-4 w-full animate-pulse bg-gray-200"></div>
                    </td>
                    <td className="border p-2">
                      <div className="skeleton-loader h-4 w-full animate-pulse bg-gray-200"></div>
                    </td>
                    <td className="border p-2">
                      <div className="skeleton-loader h-4 w-full animate-pulse bg-gray-200"></div>
                    </td>
                    <td className="border p-2">
                      <div className="skeleton-loader h-4 w-full animate-pulse bg-gray-200"></div>
                    </td>
                    <td className="border p-2">
                      <div className="skeleton-loader h-4 w-full animate-pulse bg-gray-200"></div>
                    </td>
                    <td className="border p-2">
                      <div className="skeleton-loader h-4 w-full animate-pulse bg-gray-200"></div>
                    </td>
                    <td className="border p-2">
                      <div className="skeleton-loader h-4 w-full animate-pulse bg-gray-200"></div>
                    </td>
                    {role && hasPermission([role], "update:report") && (
                      <td className="border p-2">
                        <div className="skeleton-loader h-4 w-full animate-pulse bg-gray-200"></div>
                      </td>
                    )}
                  </tr>
                ))
              : // Display actual data rows
                reports?.map((report, index) => (
                  <tr key={index} className="border">
                    <td className="border p-2">
                      {report.scopes?.map((scope) => scope.details).join(", ")}
                    </td>

                    <td className="border p-2">{report.weeklyTarget}</td>
                    <td className="border p-2">{report.actualWorkDone}</td>
                    <td className="border p-2">
                      {" "}
                      {report.scopes
                        ?.flatMap((scope) =>
                          scope.assignedTeamMembers?.map(
                            (member) =>
                              member.firstname + " " + member.lastname,
                          ),
                        )
                        .join(", ")}
                    </td>
                    <td className="border p-2">{report.percentageComplete}</td>
                    <td className="border p-2">{report.actualExpenditure}</td>
                    <td className="border p-2">{report.percentOfBudget}</td>
                    <td className="border p-2">{report.remarks}</td>
                  </tr>
                ))}
          </tbody>
        </table> */}
        <div>
          <table
            id="data-table"
            className="w-full border-collapse border border-gray-300"
          >
            <thead className="bg-black text-white">
              <tr>
                <th className="border p-2">Activity</th>
                <th className="border p-2">Weekly Target</th>
                <th className="border p-2">Actual Work Done</th>
                <th className="border p-2">Team Members</th>
                <th className="border p-2">Percentage Complete</th>
                <th className="border p-2">Actual Expenditure</th>
                <th className="border p-2">% of Budget</th>
                <th className="border p-2">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {isLoading
                ? // Display skeleton loader rows
                  Array.from({ length: 5 }).map((_, index) => (
                    <tr key={index} className="border">
                      <td className="border p-2">
                        <div className="skeleton-loader h-4 w-full animate-pulse bg-gray-200"></div>
                      </td>
                      <td className="border p-2">
                        <div className="skeleton-loader h-4 w-full animate-pulse bg-gray-200"></div>
                      </td>
                      <td className="border p-2">
                        <div className="skeleton-loader h-4 w-full animate-pulse bg-gray-200"></div>
                      </td>
                      <td className="border p-2">
                        <div className="skeleton-loader h-4 w-full animate-pulse bg-gray-200"></div>
                      </td>
                      <td className="border p-2">
                        <div className="skeleton-loader h-4 w-full animate-pulse bg-gray-200"></div>
                      </td>
                      <td className="border p-2">
                        <div className="skeleton-loader h-4 w-full animate-pulse bg-gray-200"></div>
                      </td>
                      <td className="border p-2">
                        <div className="skeleton-loader h-4 w-full animate-pulse bg-gray-200"></div>
                      </td>
                      <td className="border p-2">
                        <div className="skeleton-loader h-4 w-full animate-pulse bg-gray-200"></div>
                      </td>
                      {role && hasPermission([role], "update:report") && (
                        <td className="border p-2">
                          <div className="skeleton-loader h-4 w-full animate-pulse bg-gray-200"></div>
                        </td>
                      )}
                    </tr>
                  ))
                : // Display actual data rows
                  paginatedReports?.map((report, index) => (
                    <tr key={index} className="border">
                      <td className="border p-2">
                        {report.scopes
                          ?.map((scope) => scope.details)
                          .join(", ")}
                      </td>
                      <td className="border p-2">{report.weeklyTarget}</td>
                      <td className="border p-2">{report.actualWorkDone}</td>
                      <td className="border p-2">
                        {report.scopes
                          ?.flatMap((scope) =>
                            scope.assignedTeamMembers?.map(
                              (member) =>
                                member.firstname + " " + member.lastname,
                            ),
                          )
                          .join(", ")}
                      </td>
                      <td className="border p-2">
                        {report.percentageComplete}
                      </td>
                      <td className="border p-2">{report.actualExpenditure}</td>
                      <td className="border p-2">{report.percentOfBudget}</td>
                      <td className="border p-2">{report.remarks}</td>
                    </tr>
                  ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="mt-4 flex items-center justify-between">
            <button
              className="rounded bg-gray-300 px-4 py-2 text-black disabled:opacity-50"
              onClick={() => changePage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="rounded bg-gray-300 px-4 py-2 text-black disabled:opacity-50"
              onClick={() => changePage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>
      <div className="mt-4 space-x-4">
        <button
          onClick={exportAsPDF}
          disabled={isLoading}
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Export as PDF
        </button>
        <button
          onClick={exportAsExcel}
          disabled={isLoading}
          className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
        >
          Export as Excel
        </button>
        <button
          onClick={handlePrint}
          disabled={isLoading}
          className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
        >
          Print
        </button>
      </div>
    </div>
  );
};

export default YearReport;
