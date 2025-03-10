//@ts-nocheck
"use client";

import React, { useState, useEffect, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Delete, Pencil, PlusIcon } from "lucide-react";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import { getAllWorkPlans } from "@/app/actions/getWorkPlans";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { updateWeeklyReport } from "@/app/actions/updateWeeklyReport";

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
  percentageComplete: z.preprocess(
    (val) => (val !== "" ? Number(val) : undefined),
    z.number({
      required_error: "Please enter completed percentage.",
    }),
  ),
  budgetPercentage: z.preprocess(
    (val) => (val !== "" ? Number(val) : undefined),
    z.number({
      required_error: "Please enter completed percentage.",
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

const SHEET_SIDES = ["right"] as const;

type SheetSide = (typeof SHEET_SIDES)[number];

function WeeklyReport() {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [formData, setFormData] = useState({
    activity: "",
    weeklyTarget: 0,
    actualWorkDone: 0,
    percentageComplete: 0,
    actualExpenditure: 0,
    budgetPercentage: 0,
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

  const teamMembers = [
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
    { id: 3, name: "Charlie" },
    { id: 4, name: "Diana" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setReports([...reports, formData]);
    setFormData({
      weeklyTarget: 0,
      actualWorkDone: 0,
      percentageComplete: 0,
      actualExpenditure: 0,
      budgetPercentage: 0,
      remarks: "",
    });
  };

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      try {
        const response = await getAllWorkPlans();

        setReports(response);
      } catch (error: any) {
        console.log("");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [submitted]);

  function onSubmit(data: z.infer<typeof FormSchema>, reportId: string) {
    // console.log(data);
    startTransition(async () => {
      //   console.log(data);
      console.log("kkkk");
      await updateWeeklyReport({ ...data, reportId })
        .then((res) => {
          console.log(res);
          setSubmitted((prev) => !prev);
        })
        .catch((err) => {
          console.log("");
          throw new Error(err.message);
        });
    });
  }

  console.log(reports);

  return (
    <DefaultLayout>
      <div className="p-4">
        <h1 className="mb-4 text-2xl font-bold">Weekly Reporting Module</h1>
        <div className="no-scrollbar overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
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
                <th className="border p-2">Actions</th>
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
                      <td className="border p-2">
                        <div className="skeleton-loader h-4 w-full animate-pulse bg-gray-200"></div>
                      </td>
                    </tr>
                  ))
                : // Display actual data rows
                  reports?.map((report, index) => (
                    <tr key={index} className="border">
                      <td className="border p-2">
                        {report.scopes
                          ?.map((scope) => scope.details)
                          .join(", ")}
                      </td>
                      <td className="border p-2">{report.weeklyTarget}</td>
                      <td className="border p-2">{report.actualWorkDone}</td>
                      <td className="border p-2">
                        {" "}
                        {report.scopes
                          ?.flatMap((scope) =>
                            scope.assignedTeamMembers?.map(
                              (member) => member.firstname + " " + member.lastname,
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
                      <td className="flex items-center justify-around space-x-1 border p-2">
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
                                  />

                                  <FormField
                                    control={form.control}
                                    name="budgetPercentage"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Budget Percentage</FormLabel>
                                        <Input
                                          placeholder="Enter budget percentage"
                                          type="number"
                                          {...field}
                                          defaultValue={
                                            report.budgetPercentage || 0
                                          }
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
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size={"sm"} className="">
                              <p className="hidden lg:block">Delete</p>
                              <Delete className="text-white" size={10} />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>Edit Record</DialogTitle>
                              <DialogDescription>
                                Make changes to your activity here. Click save
                                when you're done.
                              </DialogDescription>
                            </DialogHeader>
                            <Card className="w-[350px]">
                              <CardContent>
                                <form>
                                  <div className="grid w-full items-center gap-4">
                                    <div className="flex flex-col space-y-1.5">
                                      <Label htmlFor="name">Name</Label>
                                      <Input
                                        id="name"
                                        placeholder="Name of your project"
                                      />
                                    </div>
                                    <div className="flex flex-col space-y-1.5">
                                      <Label htmlFor="framework">
                                        Framework
                                      </Label>
                                      <Select>
                                        <SelectTrigger id="framework">
                                          <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                        <SelectContent position="popper">
                                          <SelectItem value="next">
                                            Next.js
                                          </SelectItem>
                                          <SelectItem value="sveltekit">
                                            SvelteKit
                                          </SelectItem>
                                          <SelectItem value="astro">
                                            Astro
                                          </SelectItem>
                                          <SelectItem value="nuxt">
                                            Nuxt.js
                                          </SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                </form>
                              </CardContent>
                              <CardFooter className="flex justify-between">
                                <Button variant="outline">Cancel</Button>
                                <Button>Deploy</Button>
                              </CardFooter>
                            </Card>
                            <DialogFooter>
                              <Button type="submit">Save changes</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </div>
    </DefaultLayout>
  );
}

export default WeeklyReport;
