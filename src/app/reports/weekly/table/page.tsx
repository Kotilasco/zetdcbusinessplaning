//@ts-nocheck
"use client";

import React, { useState, useEffect, useTransition, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  getSectionById,
  getSectionNameById,
} from "@/app/actions/getSectionsFromDepartment";
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
import { CURRENCY, MONTHS, WEEKS } from "@/data/constants";
import {
  CalendarIcon,
  Currency,
  Delete,
  Paperclip,
  PaperclipIcon,
  Pencil,
  PlusIcon,
  TimerResetIcon,
} from "lucide-react";
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
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { rescheduleThePlan } from "@/app/actions/rescheduleTask";
import { getWeeklyExpenditureComparison } from "@/app/actions/expenditureComparison";
import StackedBarChart from "@/components/DashboardGraphs/StackedBarChart";
import BudgetPieChart from "@/components/DashboardGraphs/WeeklyPieChart";
import BudgetUsageGauge from "@/components/DashboardGraphs/WeeklyGuageChart";
import WeeklyExpenditureBarChart from "@/components/DashboardGraphs/MonthlyBarChart";
import WeeklyBudgetDonutChart from "@/components/DashboardGraphs/WeeklyDonutChart";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useSearchParams } from "next/navigation";
import * as XLSX from "xlsx";

/* export const FormSchema = z.object({
  weeklyTarget: z.number({
    required_error: "Please input a weekly target",
  }),
  actualWorkDone: z.number({
    required_error: "Please enter actual work done.",
  }),
  percentageComplete: z.number({
    required_error: "Please enter completed percentage.",
  }),
  budgetPercentage: z.number({
    required_error: "Please enter completed percentage.",
  }),
  actualExpenditure: z.number({
    required_error: "Please enter completed percentage.",
  }),
  remarks: z.string().min(2, {
    message: "remarks should be of length greaer than 2",
  }),
});
 */

export const FormSchema = z.object({
  actualWorkDone: z.preprocess(
    (val) => (val !== "" ? Number(val) : undefined),
    z.number({
      required_error: "Please enter actual work done.",
    }),
  ),
  currency: z.string().min(1, {
    message: "currency should be of length greater than 1",
  }),
  budget: z.preprocess(
    (val) => (val !== "" ? Number(val) : undefined),
    z.number({
      required_error: "Please enter budget being used.",
    }),
  ),
  actualExpenditure: z.preprocess(
    (val) => (val !== "" ? Number(val) : undefined),
    z.number({
      required_error: "Please enter completed percentage.",
    }),
  ),
  remarks: z.string().min(2, {
    message: "remarks should be of length greater than 2",
  }),
  reportId: z.number().optional(),
});

export const RescheduleSchema = z.object({
  rescheduledDate: z.date({
    required_error: "Please select a date",
  }),
  status: z.enum(["IN_PROGRESS", "COMPLETED", "CANCELLED", "RESCHEDULED"]),
});

const SHEET_SIDES = ["right"] as const;

type SheetSide = (typeof SHEET_SIDES)[number];

interface WeeklyTableProps {
  year: string;

  month: string;

  week: string;

  currency?: string;
}

const WeeklyReport: React.FC<WeeklyTableProps> = ({
  year,
  month,
  week,
  currency,
}) => {
  const [reports, setReports] = useState([]);

  const [pieData, setPieData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null); // State for date picker
  const [status, setStatus] = useState(""); // State for dropdown status
  const [section, setSection] = useState(null); // State for section data

  const handleConfirm = async (id: number) => {
    console.log(id);
    console.log("Selected Date:", selectedDate);
    console.log("Selected Status:", status);
    // Perform your rescheduling logic here

    const payload = {
      targetCompletionDate: selectedDate,
      status,
    };

    // Make the server request
    const response = await rescheduleThePlan(payload, id);

    // Handle the server's response
    //console.log(response);
  };

  const handleContinue = async (id: number) => {
    const payload = {
      status: "CANCELLED",
    };

    // Make the server request
    const response = await rescheduleThePlan(payload, id);

    // Handle the server's response
    // console.log(response);
  };

  const [formData, setFormData] = useState({
    activity: "",
    actualWorkDone: 0,
    percentageComplete: 0,
    actualExpenditure: 0,
    budget: 0,
    remarks: "",
  });

  /* const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }; */

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {},
  });

  const handleChange = (e) => {
    const { name, value, type, options } = e.target;

    if (type === "select-multiple") {
      // Handle multi-select logic for teamMembers
      const selectedValues = Array.from(options)
        .filter((option) => option.selected)
        .map((option) => option.value);
      setFormData({ ...formData, [name]: selectedValues });
    } else {
      // Handle other input fields
      setFormData({ ...formData, [name]: value });
    }
  };

  const role = useCurrentRole();

  const handleSubmit = (e) => {
    e.preventDefault();
    setReports([...reports, formData]);
    setFormData({
      actualWorkDone: 0,
      percentageComplete: 0,
      actualExpenditure: 0,
      budget: 0,
      remarks: "",
    });
  };

  // Table reference for printing
  const tableRef = useRef(null);

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      try {
        const response = await getAllWorkPlansFilter({ year, month, week });

        setReports(response);
      } catch (error: any) {
        console.log("");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [submitted, year, month, week]);

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      try {
        const response = await getSectionById();

        setSection(response);
      } catch (error: any) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      try {
        const pieData = await getWeeklyExpenditureComparison({
          year,
          month,
          week,
          currency,
        });

        //console.log(pieData);
        setPieData(pieData);
      } catch (error: any) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [submitted, year, month, week, currency]);

  function onSubmit(data: z.infer<typeof FormSchema>, reportId: string) {
    //console.log(data);
    startTransition(async () => {
      await updateWeeklyReport({ ...data, reportId })
        .then((res) => {
          //   console.log(res);
          setSubmitted((prev) => !prev);
        })
        .catch((err) => {
          console.log("");
          throw new Error(err.message);
        });
    });
  }

  function onReschedule(data: z.infer<typeof FormSchema>, reportId: string) {
    console.log(data);
  }

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
      doc.text(`Report For Week ${week} of ${month} ${year}`, 50, 20); // Adjust x and y position

      doc.setFontSize(14);
      doc.text(`Section: ${section?.name}`, 50, 30); // Adjust x and y position

      // Draw a line under the header
      doc.line(10, 35, 200, 35); // From (x1, y1) to (x2, y2)

      // Reference the table and ensure it exists
      const table = document.getElementById("data-table");
      if (!table) {
        console.error("Table element not found!");
        return;
      }

      // Use autoTable to add the table content
      autoTable(doc, {
        html: table,
        startY: 40,
        styles: { overflow: "linebreak", cellPadding: 3 },
        columnStyles: {
          0: { halign: "left" }, // Left-align text
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

      // Save the PDF
      const fileName = `WorkPlans_${new Date().toISOString()}.pdf`;
      doc.save(fileName);
    };
  }; */

  // Export table as PDF
  /* const exportAsPDF = () => {
    const doc = new jsPDF();

    // Add logo
    const logoUrl = "/images/logo/zetdc.png"; // Your logo file
    const img = new Image();
    img.src = logoUrl;

    img.onload = () => {
      doc.addImage(img, "PNG", 10, 5, 30, 30); // Position (x, y) and size (width, height)

      // Add a header after the logo
      doc.setFontSize(18);
      doc.text(
        `Report For Week ${parseInt(week.substring(4))} of ${month} ${year}`,
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

      // Iterate over grouped data and add each section's table
      Object.keys(groupedReports).forEach((sectionId, index) => {
        const sectionReports = groupedReports[sectionId];

        // Add section header
        doc.setFontSize(14);
        doc.text(`Section ${sectionId}`, 10, startY); // Replace with section name if available
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
      const fileName = `WorkPlans_${new Date().toISOString()}.pdf`;
      doc.save(fileName);
    };
  }; */
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
      doc.text(
        `Report For Week ${parseInt(week.substring(4))} of ${month} ${year}`,
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
      const fileName = `WorkPlans_${new Date().toISOString()}.pdf`;
      doc.save(fileName);
    };
  };
  // Export table as Excel
  const exportAsExcel = () => {
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

    const worksheet = XLSX.utils.aoa_to_sheet([
      headers,
      ...rows.filter((row) => row.length > 0),
    ]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "WorkPlans");

    const timestamp = new Date().toISOString().replace(/[-:.]/g, "");
    XLSX.writeFile(workbook, `WorkPlans_${timestamp}.xlsx`);
  };

  // Print the table
  const handlePrint = () => {
    const clonedTable = tableRef.current.cloneNode(true);

    // Remove the "Actions" column (header + body)
    clonedTable.querySelectorAll("tr").forEach((row) => {
      row.querySelectorAll("th, td").forEach((cell, index) => {
        if (cell.innerText.trim() === "Actions" || index === 8) {
          // Adjust index if needed
          cell.remove();
        }
      });
    });

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
          ${clonedTable.outerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const searchParams = useSearchParams();

  const filters = {
    year: year || "2025",
    month: month || "January",
    week: week || "week1",
    currency: currency || "USD",
  };

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">Weekly Reporting Module</h1>
      <div className="no-scrollbar mb-5 overflow-x-auto" ref={tableRef}>
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
              {role && hasPermission([role], "update:report") && (
                <th className="border p-2">Actions</th>
              )}
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
                  <tr
                    key={index}
                    className="cursor-pointer border transition hover:bg-gray-100"
                    onClick={() =>
                      (window.location.href = `/work/plan/${report.id}`)
                    }
                  >
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
                    <td className="border p-2">
                      {" "}
                      {parseFloat(report.percentageComplete.toFixed(2))}
                    </td>
                    <td className="border p-2">
                      {report.actualExpenditure} {report.currency}
                    </td>
                    <td className="border p-2">
                      {report.percentOfBudget?.toFixed(2)}
                    </td>
                    <td className="border p-2">{report.remarks}</td>
                    {role && hasPermission([role], "update:report") && (
                      <td
                        className="flex items-center justify-around space-x-1 border p-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button
                          size={"sm"}
                          onClick={() =>
                            (window.location.href = `/work/plan/attach/${report.id}`)
                          }
                          className="rounded bg-blue-500 px-3 py-2 text-white transition hover:bg-blue-700"
                        >
                          <p className="hidden lg:block">Attach</p>
                          <PaperclipIcon className="text-white" size={10} />
                        </Button>

                        <div className="">
                          <Sheet>
                            <SheetTrigger asChild>
                              <Button size={"sm"}>
                                <p className="hidden lg:block">Edit</p>
                                <Pencil size={10} className="text-white" />
                              </Button>
                            </SheetTrigger>
                            <SheetContent
                              side="right"
                              className="no-scrollbar h-full overflow-y-auto"
                            >
                              <SheetHeader>
                                <SheetTitle>Add Work Plan</SheetTitle>
                                <SheetDescription>
                                  Add a work plan for a particular month.
                                </SheetDescription>
                              </SheetHeader>
                              <Form {...form}>
                                <form
                                  onSubmit={form.handleSubmit((data) =>
                                    onSubmit(data, report.id),
                                  )}
                                  className="mb-6 grid gap-4 py-4"
                                >
                                  <FormField
                                    control={form.control}
                                    name="actualWorkDone"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Actual Work Done</FormLabel>
                                        <Input
                                          placeholder="Enter Actual Work Done"
                                          type="number"
                                          {...field}
                                          defaultValue={
                                            report.actualWorkDone || 0
                                          }
                                        />
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />

                                  <FormField
                                    control={form.control}
                                    name="currency"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Currency</FormLabel>
                                        <Select
                                          onValueChange={field.onChange}
                                          defaultValue={field.value}
                                        >
                                          <FormControl>
                                            <SelectTrigger>
                                              <SelectValue placeholder="Select a valid currency" />
                                            </SelectTrigger>
                                          </FormControl>
                                          <SelectContent>
                                            {CURRENCY.map((curr) => (
                                              <SelectItem
                                                key={curr.value}
                                                value={curr.value}
                                              >
                                                {curr.label}
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>

                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />

                                  {/*  <FormField
                                    control={form.control}
                                    name="percentageComplete"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>
                                          Percentage completed
                                        </FormLabel>
                                        <Input
                                          placeholder="Enter percentage completed"
                                          type="number"
                                          {...field}
                                          defaultValue={
                                            report.percentageComplete || 0
                                          }
                                        />
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  /> */}

                                  <FormField
                                    control={form.control}
                                    name="budget"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Budget To Use</FormLabel>
                                        <Input
                                          placeholder="Enter budget percentage"
                                          type="number"
                                          {...field}
                                          defaultValue={report.budget || 0}
                                        />
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />

                                  <FormField
                                    control={form.control}
                                    name="actualExpenditure"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>
                                          Actual Expenditure
                                        </FormLabel>
                                        <Input
                                          placeholder="Enter actual expenditure"
                                          type="number"
                                          {...field}
                                          defaultValue={
                                            report.actualExpenditure || 0
                                          }
                                        />
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />

                                  <FormField
                                    control={form.control}
                                    name="remarks"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Remarks</FormLabel>
                                        <FormControl>
                                          <Textarea
                                            placeholder="Write the scope to be performed"
                                            className="resize-none"
                                            defaultValue={report.remarks || ""}
                                            {...field}
                                          />
                                        </FormControl>

                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <Button disabled={isPending} type="submit">
                                    Submit
                                  </Button>
                                </form>
                              </Form>

                              <SheetFooter>
                                <SheetClose asChild>
                                  <Button hidden>Close</Button>
                                </SheetClose>
                              </SheetFooter>
                            </SheetContent>
                          </Sheet>
                        </div>
                        <div>
                          {/* <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size={"sm"} className="">
                                <p className="hidden lg:block">Reschedule</p>
                                <TimerResetIcon
                                  className="text-white"
                                  size={10}
                                />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Are you absolutely sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will
                                  permanently reschedule the ticket.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction>Continue</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog> */}
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size={"sm"} className="">
                                <p className="hidden lg:block">Reschedule</p>
                                <TimerResetIcon
                                  className="text-white"
                                  size={10}
                                />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="no-scrollbar h-96 overflow-y-auto">
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Reschedule Ticket
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Pick a new date and select the status for the
                                  ticket. This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>

                              {/* Date Picker */}

                              <div className="">
                                <Calendar
                                  className=" "
                                  mode="single"
                                  selected={selectedDate}
                                  onSelect={setSelectedDate}
                                  /*  disabled={(date) =>
                                                  date > new Date() ||
                                                  date < new Date("1900-01-01")
                                                } */
                                  initialFocus
                                />
                              </div>

                              {/* Dropdown (Status Picker) */}
                              <div className="mb-4">
                                <label className="mb-1 block text-sm font-medium">
                                  Select Status
                                </label>
                                <Select onValueChange={setStatus}>
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select status" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="IN_PROGRESS">
                                      In Progress
                                    </SelectItem>
                                    <SelectItem value="RESCHEDULED">
                                      Rescheduled
                                    </SelectItem>
                                    <SelectItem value="COMPLETED">
                                      Completed
                                    </SelectItem>
                                    <SelectItem value="CANCELLED">
                                      Cancelled
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  disabled={!selectedDate && !status}
                                  onClick={() => handleConfirm(report?.id)}
                                >
                                  Confirm
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                        <div>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size={"sm"} className="">
                                <p className="hidden lg:block">Cancel</p>
                                <Delete className="text-white" size={10} />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Are you absolutely sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will
                                  permanently cancel you the ticket.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleContinue(report?.id)}
                                >
                                  Continue
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </td>
                    )}
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

      <hr />
      <div className="mx-auto my-4 h-96 w-full p-2">
        <h2>Comparing expenditure and budget</h2>
        <StackedBarChart data={pieData} />
      </div>

      {/* <hr />
      <div className="mx-auto my-4 w-full p-2">
        <h2>Comparing expenditure and budget</h2>
        <BudgetPieChart data={pieData} />
      </div>

      <hr />
      <div className="mx-auto my-4 h-96 w-full p-2">
        <h2>Percent of Budget Used</h2>
        <BudgetUsageGauge data={pieData} />
      </div> */}

      {/* <hr />
      <div className="mx-auto my-4 h-96 w-full p-2">
        <h2> Expenditure vs Remaining Budget</h2>
        <WeeklyBudgetDonutChart data={pieData} />
      </div> */}
    </div>
  );
};

export default WeeklyReport;
