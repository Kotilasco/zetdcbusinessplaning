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

  const role = useCurrentRole();

  // Table reference for printing
  const tableRef = useRef(null);

  // Export table as PDF
  const exportAsPDF = () => {
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
        </table>
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
