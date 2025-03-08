///@ts-nocheck

"use client";

import React, { useState, useTransition, useEffect } from "react";
import * as z from "zod";
import { RegistrationSchema, UserCreationSchema } from "@/schema";
import { CardWrapper } from "./CardWrapper";
import { useForm } from "react-hook-form";
import { FormError } from "@/components/FormError";
import { FormSuccess } from "@/components/FormSuccess";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { createUser, register } from "@/app/actions/register";
import { ComboboxForm } from "./Reference";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Link from "next/link";
import { getDepartments } from "@/app/actions/getDepartments";
import DepartmentCreationForm from "../AdminDashboard/DepartmentCreationForm";

const roles = [
  { label: "MANAGER", value: "MANAGER" },
  { label: "SENIOR MANAGER", value: "SENIORMANAGER" },
  { label: "HOD", value: "HOD" },
  { label: "ADMIN", value: "ADMIN" },
  { label: "PROJECT ENGINEER", value: "PROJECTENGINEER" },
] as const;

function UserCreationForm() {
  const [isPending, startTransition] = useTransition();
  const [departments, setDepartments] = useState(null);
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const form = useForm<z.infer<typeof UserCreationSchema>>({
    resolver: zodResolver(UserCreationSchema),
    defaultValues: {
      email: "",
      firstname: "",
      lastname: "",
      role: "",
    },
  });

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      try {
        const response = await getDepartments();

        setDepartments(response);
      } catch (error: any) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [submitted]);

  const onSubmit = (values: z.infer<typeof UserCreationSchema>) => {
    setError("");
    setSuccess("");
    startTransition(() => {
      createUser(values).then((data) => {
        setError(data?.error);
        setSuccess(data?.success);
        // console.log(data);
      });
    });
  };
  const no_dep = !departments || departments.length === 0;

  return (
    <Form {...form}>
      <form
        className="h-[95%] w-full space-y-4 bg-white p-5  lg:mt-2 lg:h-[70%]"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="space-y-2">
          <div className="lg:flex lg:flex-row lg:justify-between lg:space-x-5">
            <div className="w-full lg:w-1/2">
              <FormField
                control={form.control}
                name="firstname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="First Name"
                        type="name"
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="w-full lg:w-1/2">
              <FormField
                control={form.control}
                name="lastname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Last Name"
                        type="name"
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          {/*  <div className="lg:flex lg:flex-row lg:justify-between lg:space-x-5">
            <div className="w-full lg:w-1/2"> */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="johndoe@gmail.com"
                    type="email"
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Reference</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "w-full justify-between",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value
                          ? roles.find((role) => role.value === field.value)
                              ?.label
                          : "Select Role"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0 pt-2">
                    <Command>
                      <CommandInput placeholder="Search reference type..." />
                      <CommandList>
                        <CommandEmpty>No role selected.</CommandEmpty>
                        <CommandGroup>
                          {roles.map((role) => (
                            <CommandItem
                              value={role.label}
                              key={role.value}
                              onSelect={() => {
                                form.setValue("role", role.value);
                              }}
                            >
                              {role.label}
                              <Check
                                className={cn(
                                  "ml-auto",
                                  role.value === field.value
                                    ? "opacity-100"
                                    : "opacity-0",
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormDescription>This is the role of the user</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {departments != null && departments.length > 0 && (
            <FormField
              control={form.control}
              name="department"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Department</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full justify-between",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value
                            ? departments.find(
                                (department) => department.id === field.value,
                              )?.name
                            : "Select Department"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0 pt-2">
                      <Command>
                        <CommandInput placeholder="Search department..." />
                        <CommandList>
                          <CommandEmpty>No department selected.</CommandEmpty>
                          <CommandGroup>
                            {departments.map((department) => (
                              <CommandItem
                                value={department.id}
                                key={department.id}
                                onSelect={() => {
                                  form.setValue("department", department.id); // Set department ID
                                  form.setValue("section", ""); // Reset section on department change
                                }}
                              >
                                {department.name}
                                <Check
                                  className={cn(
                                    "ml-auto",
                                    department.id === field.value
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    This is the department of the user
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {form.watch("department") && (
            <FormField
              control={form.control}
              name="section"
              render={({ field }) => {
                const selectedDepartmentId = form.watch("department");
                const sections =
                  departments.find(
                    (department) => department.id === selectedDepartmentId,
                  )?.assignedSections || []; // Get sections for the selected department

                return (
                  <FormItem className="flex flex-col">
                    <FormLabel>Section</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "w-full justify-between",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value
                              ? sections.find(
                                  (section) => section.id === field.value,
                                )?.name
                              : "Select Section"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0 pt-2">
                        <Command>
                          <CommandInput placeholder="Search section..." />
                          <CommandList>
                            <CommandEmpty>No section selected.</CommandEmpty>
                            <CommandGroup>
                              {sections.map((section) => (
                                <CommandItem
                                  value={section.id}
                                  key={section.id}
                                  onSelect={() => {
                                    form.setValue("section", section.id); // Set section ID
                                  }}
                                >
                                  {section.name}
                                  <Check
                                    className={cn(
                                      "ml-auto",
                                      section.id === field.value
                                        ? "opacity-100"
                                        : "opacity-0",
                                    )}
                                  />
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      This is the section within the selected department
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          )}
        </div>
        <FormError message={error} />
        <FormSuccess message={success} />
        <Button disabled={isPending || no_dep} type="submit" className="w-full">
          Create
        </Button>
        {no_dep && (
          <>
            <p>You can create a department here to be able to create a user</p>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="mx-auto w-full">
                  Create department and section
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]  ">
                <DialogHeader>
                  <DialogTitle>Create Department</DialogTitle>
                </DialogHeader>
                <DepartmentCreationForm />
              </DialogContent>
            </Dialog>
          </>
        )}
      </form>
    </Form>
  );
}

export default UserCreationForm;
