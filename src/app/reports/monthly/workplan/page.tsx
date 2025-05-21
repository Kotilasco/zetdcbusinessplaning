//@ts-nocheck

"use client";

import { useEffect, useState, useTransition, useRef } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { PlusIcon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MONTHS, WEEKS } from "@/data/constants";
import { createWorkPlan } from "@/app/actions/createWorkPlan";
import { getAllWorkPlans, workPlans } from "@/app/actions/getWorkPlans";
import { getMembersBySectionId } from "@/app/actions/getTeamMembers";
import { Input } from "@/components/ui/input";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { cn } from "@/lib/utils";
import { useCurrentRole } from "@/hooks/use-current-role";
import { getAllWorkPlansBySection } from "@/app/actions/getWorkPlansBySection";
import { hasPermission } from "@/permissions";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { getSectionById } from "@/app/actions/getSectionsFromDepartment";

export const FormSchema = z.object({
  month: z.string({
    required_error: "Please select a month.",
  }),
  week: z.string({
    required_error: "Please select a week.",
  }),
  year: z.string({
    required_error: "Please select a week.",
  }),
  weeklyTarget: z.string({
    required_error: "Please enter a weekly target.",
  }),
  planName: z
    .string()
    .min(2, {
      message: "Plan name must be at least 2 characters.",
    })
    .max(100, {
      message: "Plan name must not exceed 100 characters.",
    }),
  scope: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  team: z.array(z.number()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one item.",
  }),
  target: z.date({ required_error: "Please select a date." }),
  startDate: z.date({ required_error: "Please select a date." }),
});

export default function SelectForm() {
  const [workPlans, setWorkPlans] = useState<workPlans>([]);
  const [formData, setFormData] = useState({
    month: "",
    week: "",
    scope: "",
    planName: "",
    teamMembers: [],
    startDate: null,
    target: null,
  });

  // Table reference for printing
  const tableRef = useRef(null);

  const now = new Date();

  // Get the current year
  const year = now.getFullYear();

  // Get the current month name
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const month = monthNames[now.getMonth()];
  const dayOfMonth = now.getDate();

  // Get the current week number
  const week = Math.ceil(dayOfMonth / 7);

  const role = useCurrentRole();

  const [selectedMembers, setSelectedMembers] = useState([]);
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [members, setMembers] = useState(null);
  const [section, setSection] = useState(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Number of rows per page

  // Calculate total pages
  const totalPages = Math.ceil((workPlans?.length || 0) / itemsPerPage);

  // Get the data for the current page
  const paginatedWorkPlans = workPlans?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Handle page change
  const changePage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const years = Array.from({ length: 1 }, (_, i) => 2025 + i);

  const handleToggleMember = (memberName) => {
    setSelectedMembers((prevSelected) =>
      prevSelected.includes(memberName)
        ? prevSelected.filter((name) => name !== memberName)
        : [...prevSelected, memberName],
    );
  };
  const today = new Date();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

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
        const response = await getAllWorkPlansBySection();

        setWorkPlans(response);
      } catch (error: any) {
        toast({
          title: "Error fetch",
          description: error?.message,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [submitted]);

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      try {
        const response = await getMembersBySectionId();

        setMembers(response);
      } catch (error: any) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [submitted]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setWorkPlans([...workPlans, { ...formData, teamMembers: selectedMembers }]);
    setFormData({ month: "", week: "", scope: "", teamMembers: [] });
    setSelectedMembers([]);
  };
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      items: ["recents", "home"],
      team: [],
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    startTransition(async () => {
      // console.log(data);
      console.log("kkkk");
      await createWorkPlan(data)
        .then((res) => {
          console.log(res);
          form.reset();
          setSubmitted((prev) => !prev);
        })
        .catch((err) => {
          toast({
            title: "Error posting",
            description: err?.message,
          });
          throw new Error(err.message);
        });
    });
  }

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
      doc.text(`Work Plans Module For ${month} ${year}`, 50, 20); // Adjust x and y position

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
        startY: 40, // Adjust to prevent overlap with the header
        styles: { overflow: "linebreak", cellPadding: 3 },
        columnStyles: {
          2: { cellWidth: 50 }, // Adjust column width for "Scope"
          3: { cellWidth: 70 }, // Adjust column width for "Team Members"
        },
      });

      // Save the PDF
      const fileName = `WorkPlans_${new Date().toISOString().split("T")[0]}.pdf`;
      doc.save(fileName);
    };
  };

  // Export table as Excel
  const exportAsExcel = () => {
    const table = /* document.getElementById("data-table"); */ tableRef.current;
    const workbook = XLSX.utils.table_to_book(table, { sheet: "WorkPlans" });
    const fileName = `WorkPlans_${new Date().toISOString().split("T")[0]}.xlsx`;
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
  return (
    <DefaultLayout>
      <div className="p-4 ">
        <h1 className="mb-4 text-2xl font-bold">Work Plan Module</h1>

        {/* Work Plan Table */}
        <div>
          <div ref={tableRef}>
            <table
              id="data-table"
              className="w-full border-collapse border border-gray-300"
            >
              <thead className="bg-black text-white">
                <tr>
                  <th className="border p-2">Month</th>
                  <th className="border p-2">Week</th>
                  <th className="border p-2">Plan Name</th>
                  <th className="border p-2">Scope</th>
                  <th className="border p-2">Team Members</th>
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
                      </tr>
                    ))
                  : // Display actual data rows
                    paginatedWorkPlans?.map((plan, index) => (
                      <tr key={index} className="border">
                        <td className="border p-2">{plan.month}</td>
                        <td className="border p-2">{plan.week}</td>
                        <td className="border p-2">{plan.planName}</td>
                        <td className="border p-2">
                          {plan.scopes
                            ?.map((scope) => scope.details)
                            .join(", ")}
                        </td>
                        <td className="border p-2">
                          {plan.scopes
                            ?.flatMap((scope) =>
                              scope.assignedTeamMembers?.map(
                                (member) =>
                                  member.firstname + " " + member.lastname,
                              ),
                            )
                            .join(" - ")}
                        </td>
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

        {role && hasPermission([role], "create:workplan") && (
          <div className="mt-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="default" className="mt-5">
                  Add Work Plan <PlusIcon size={16} className="ml-2" />
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
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="mb-6 grid gap-4 py-4"
                  >
                    <FormField
                      control={form.control}
                      name="week"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Week</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select a week" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>Week</SelectLabel>
                                {WEEKS.map((week) => (
                                  <SelectItem value={week.value}>
                                    {week.label}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="month"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Month</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select a month" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>Month</SelectLabel>
                                {MONTHS.map((month) => (
                                  <SelectItem value={month.value}>
                                    {month.label}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="year"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Year</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select a year" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectGroup>
                                {years.map((year) => (
                                  <SelectItem value={year.toString()}>
                                    {year.toString()}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="planName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Plan Name</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Write a simple description of the plan"
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="scope"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Scope</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Write the scope to be performed"
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="weeklyTarget"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Weekly Target</FormLabel>
                          <Input placeholder="Enter weekly target" {...field} />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="team"
                      render={({ field }) => (
                        <FormItem>
                          <div className="mb-4">
                            <FormLabel className="text-base">
                              Team Members
                            </FormLabel>
                            <FormDescription>
                              Select the members you want to assign
                            </FormDescription>
                          </div>
                          {members.map((item) => (
                            <FormItem
                              key={item.id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={
                                    field.value?.includes(item.id) || false
                                  } // Safely handle undefined
                                  onCheckedChange={(checked) => {
                                    const currentValue = field.value || []; // Initialize as an empty array if undefined
                                    if (checked) {
                                      field.onChange([
                                        ...currentValue,
                                        item.id,
                                      ]); // Add member ID to the array
                                    } else {
                                      field.onChange(
                                        currentValue.filter(
                                          (value) => value !== item.id,
                                        ), // Remove member ID from the array
                                      );
                                    }
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-normal">
                                {item.firstname} {item.lastname}
                              </FormLabel>
                            </FormItem>
                          ))}
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Starting Date</FormLabel>
                          <FormControl>
                            <DatePicker
                              selected={field.value}
                              onChange={field.onChange}
                              minDate={today}
                              dateFormat="yyyy-MM-dd"
                              className={cn(
                                "w-full rounded-md border px-3 py-2",
                                form.formState.errors.date && "border-red-500",
                              )}
                            />
                          </FormControl>
                          <FormMessage>
                            {form.formState.errors.date?.message}
                          </FormMessage>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="target"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Target Date</FormLabel>
                          <FormControl>
                            <DatePicker
                              selected={field.value}
                              onChange={field.onChange}
                              minDate={today}
                              dateFormat="yyyy-MM-dd"
                              className={cn(
                                "w-full rounded-md border px-3 py-2",
                                form.formState.errors.date && "border-red-500",
                              )}
                            />
                          </FormControl>
                          <FormMessage>
                            {form.formState.errors.date?.message}
                          </FormMessage>
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
        )}
      </div>
    </DefaultLayout>
  );
}
