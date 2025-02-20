//@ts-nocheck

"use client";

import { useEffect, useState, useTransition } from "react";
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
import { createWorkPlan } from "@/actions/createWorkPlan";
import { getAllWorkPlans, workPlans } from "@/actions/getWorkPlans";
import { getMembersBySectionId } from "@/actions/getTeamMembers";
import { Input } from "@/components/ui/input";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { cn } from "@/lib/utils";
import { useCurrentRole } from "@/hooks/use-current-role";
import { getAllWorkPlansBySection } from "@/actions/getWorkPlansBySection";
import { hasPermission } from "@/permissions";

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
  weeklyTarget: z.preprocess(
    (val) => (val !== "" ? Number(val) : undefined), // Convert to number
    z.number({
      required_error: "Please input a weekly target",
    }),
  ),
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
    teamMembers: [],
    startDate: null,
    target: null,
  });

  const role = useCurrentRole();

  const [selectedMembers, setSelectedMembers] = useState([]);
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [members, setMembers] = useState(null);

  const teamMembers = [
    { id: "1", name: "Alice" },
    { id: "2", name: "Bob" },
    { id: "3", name: "Charlie" },
    { id: "4", name: "Diana" },
  ];

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
      console.log(data);
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

  return (
    <DefaultLayout>
      <div className="p-4">
        <h1 className="mb-4 text-2xl font-bold">Work Plan Module</h1>

        {/* Work Plan Table */}
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-black text-white">
            <tr>
              <th className="border p-2">Month</th>
              <th className="border p-2">Week</th>
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
                  </tr>
                ))
              : // Display actual data rows
                workPlans?.map((plan, index) => (
                  <tr key={index} className="border">
                    <td className="border p-2">{plan.month}</td>
                    <td className="border p-2">{plan.week}</td>
                    <td className="border p-2">
                      {plan.scopes?.map((scope) => scope.details).join(", ")}
                    </td>
                    <td className="border p-2">
                      {plan.scopes
                        ?.flatMap((scope) =>
                          scope.assignedTeamMembers?.map(
                            (member) => member.email,
                          ),
                        )
                        .join(" - ")}
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>

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
                          <Input
                            placeholder="Enter weekly target"
                            type="number"
                            {...field}
                            defaultValue={0}
                          />
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
